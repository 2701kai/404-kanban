import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Column, Card } from "@/types";
import { db, columns as columnsTable, cards as cardsTable, DbColumn, DbCard } from "@/lib/db";
import { eq, asc } from "drizzle-orm";

interface BoardContextType {
  columns: Column[];
  cards: Card[];
  archivedCards: Card[];
  loading: boolean;
  refetch: () => Promise<void>;
  addColumn: (column: Omit<Column, 'id'>) => Promise<void>;
  updateColumn: (column: Column) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  addCard: (card: Omit<Card, 'id' | 'createdAt'>) => Promise<void>;
  updateCard: (card: Card) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, newColumnId: string) => Promise<void>;
  archiveCard: (cardId: string) => Promise<void>;
  restoreCard: (cardId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType>({
  columns: [],
  cards: [],
  archivedCards: [],
  loading: true,
  refetch: async () => {},
  addColumn: async () => {},
  updateColumn: async () => {},
  deleteColumn: async () => {},
  addCard: async () => {},
  updateCard: async () => {},
  deleteCard: async () => {},
  moveCard: async () => {},
  archiveCard: async () => {},
  restoreCard: async () => {}
});

// Transform DB types to app types
const dbColumnToColumn = (db: DbColumn): Column => ({
  id: db.id,
  name: db.name,
  color: db.color
});

const dbCardToCard = (dbCard: DbCard): Card => ({
  id: dbCard.id,
  columnId: dbCard.columnId,
  title: dbCard.title,
  description: dbCard.description ?? undefined,
  labels: dbCard.labels ?? [],
  dueDate: dbCard.dueDate?.toISOString() ?? undefined,
  attachmentCount: dbCard.attachmentCount ?? 0,
  commentCount: dbCard.commentCount ?? 0,
  createdAt: dbCard.createdAt?.toISOString() ?? new Date().toISOString(),
  archivedAt: dbCard.archivedAt?.toISOString() ?? undefined
});

export function BoardProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [archivedCards, setArchivedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [columnsData, cardsData] = await Promise.all([
        db.select().from(columnsTable).orderBy(asc(columnsTable.order)),
        db.select().from(cardsTable).orderBy(asc(cardsTable.order))
      ]);

      setColumns(columnsData.map(dbColumnToColumn));

      const active = cardsData.filter(c => !c.archivedAt);
      const archived = cardsData.filter(c => c.archivedAt);
      setCards(active.map(dbCardToCard));
      setArchivedCards(archived.map(dbCardToCard));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data and poll for updates (no realtime with Neon)
  useEffect(() => {
    fetchData();

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const addColumn = async (column: Omit<Column, 'id'>) => {
    const [data] = await db.insert(columnsTable).values({
      name: column.name,
      color: column.color,
      order: columns.length
    }).returning();

    if (data) setColumns([...columns, dbColumnToColumn(data)]);
  };

  const updateColumn = async (column: Column) => {
    await db.update(columnsTable)
      .set({ name: column.name, color: column.color })
      .where(eq(columnsTable.id, column.id));

    setColumns(columns.map(c => c.id === column.id ? column : c));
  };

  const deleteColumn = async (columnId: string) => {
    await db.delete(columnsTable).where(eq(columnsTable.id, columnId));
    setColumns(columns.filter(c => c.id !== columnId));
  };

  const addCard = async (card: Omit<Card, 'id' | 'createdAt'>) => {
    const columnCards = cards.filter(c => c.columnId === card.columnId);
    const [data] = await db.insert(cardsTable).values({
      columnId: card.columnId,
      title: card.title,
      description: card.description,
      labels: card.labels ?? [],
      dueDate: card.dueDate ? new Date(card.dueDate) : null,
      order: columnCards.length,
      attachmentCount: card.attachmentCount ?? 0,
      commentCount: card.commentCount ?? 0
    }).returning();

    if (data) setCards([...cards, dbCardToCard(data)]);
  };

  const updateCard = async (card: Card) => {
    await db.update(cardsTable)
      .set({
        title: card.title,
        description: card.description,
        labels: card.labels ?? [],
        dueDate: card.dueDate ? new Date(card.dueDate) : null,
        attachmentCount: card.attachmentCount,
        commentCount: card.commentCount
      })
      .where(eq(cardsTable.id, card.id));

    setCards(cards.map(c => c.id === card.id ? card : c));
  };

  const moveCard = async (cardId: string, newColumnId: string) => {
    await db.update(cardsTable)
      .set({ columnId: newColumnId })
      .where(eq(cardsTable.id, cardId));

    setCards(cards.map(c => c.id === cardId ? { ...c, columnId: newColumnId } : c));
  };

  const deleteCard = async (cardId: string) => {
    await db.delete(cardsTable).where(eq(cardsTable.id, cardId));
    setCards(cards.filter(c => c.id !== cardId));
  };

  const archiveCard = async (cardId: string) => {
    const now = new Date();
    await db.update(cardsTable)
      .set({ archivedAt: now })
      .where(eq(cardsTable.id, cardId));

    const cardToArchive = cards.find(c => c.id === cardId);
    if (cardToArchive) {
      setCards(cards.filter(c => c.id !== cardId));
      setArchivedCards([...archivedCards, { ...cardToArchive, archivedAt: now.toISOString() }]);
    }
  };

  const restoreCard = async (cardId: string) => {
    await db.update(cardsTable)
      .set({ archivedAt: null })
      .where(eq(cardsTable.id, cardId));

    const cardToRestore = archivedCards.find(c => c.id === cardId);
    if (cardToRestore) {
      const { archivedAt, ...restoredCard } = cardToRestore;
      setArchivedCards(archivedCards.filter(c => c.id !== cardId));
      setCards([...cards, restoredCard as Card]);
    }
  };

  return (
    <BoardContext.Provider value={{
      columns,
      cards,
      archivedCards,
      loading,
      refetch: fetchData,
      addColumn,
      updateColumn,
      deleteColumn,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      archiveCard,
      restoreCard
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  return useContext(BoardContext);
}
