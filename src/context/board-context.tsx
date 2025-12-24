import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Column, Card } from "@/types";
import { supabase, DbColumn, DbCard } from "@/lib/supabase";

interface BoardContextType {
  columns: Column[];
  cards: Card[];
  archivedCards: Card[];
  loading: boolean;
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

const dbCardToCard = (db: DbCard): Card => ({
  id: db.id,
  columnId: db.column_id,
  title: db.title,
  description: db.description ?? undefined,
  labels: db.labels ?? [],
  dueDate: db.due_date ?? undefined,
  attachmentCount: db.attachment_count,
  commentCount: db.comment_count,
  createdAt: db.created_at,
  archivedAt: db.archived_at ?? undefined
});

export function BoardProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [archivedCards, setArchivedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [columnsRes, cardsRes] = await Promise.all([
          supabase.from('columns').select('*').order('order'),
          supabase.from('cards').select('*').order('order')
        ]);

        if (columnsRes.data) {
          setColumns(columnsRes.data.map(dbColumnToColumn));
        }

        if (cardsRes.data) {
          const active = cardsRes.data.filter(c => !c.archived_at);
          const archived = cardsRes.data.filter(c => c.archived_at);
          setCards(active.map(dbCardToCard));
          setArchivedCards(archived.map(dbCardToCard));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Subscribe to realtime updates
    const columnsSubscription = supabase
      .channel('columns-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'columns' },
        () => fetchData()
      )
      .subscribe();

    const cardsSubscription = supabase
      .channel('cards-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' },
        () => fetchData()
      )
      .subscribe();

    return () => {
      columnsSubscription.unsubscribe();
      cardsSubscription.unsubscribe();
    };
  }, []);

  const addColumn = async (column: Omit<Column, 'id'>) => {
    const { data, error } = await supabase
      .from('columns')
      .insert({ name: column.name, color: column.color, order: columns.length })
      .select()
      .single();

    if (error) throw error;
    if (data) setColumns([...columns, dbColumnToColumn(data)]);
  };

  const updateColumn = async (column: Column) => {
    const { error } = await supabase
      .from('columns')
      .update({ name: column.name, color: column.color })
      .eq('id', column.id);

    if (error) throw error;
    setColumns(columns.map(c => c.id === column.id ? column : c));
  };

  const deleteColumn = async (columnId: string) => {
    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', columnId);

    if (error) throw error;
    setColumns(columns.filter(c => c.id !== columnId));
  };

  const addCard = async (card: Omit<Card, 'id' | 'createdAt'>) => {
    const columnCards = cards.filter(c => c.columnId === card.columnId);
    const { data, error } = await supabase
      .from('cards')
      .insert({
        column_id: card.columnId,
        title: card.title,
        description: card.description,
        labels: card.labels ?? [],
        due_date: card.dueDate,
        order: columnCards.length,
        attachment_count: card.attachmentCount ?? 0,
        comment_count: card.commentCount ?? 0
      })
      .select()
      .single();

    if (error) throw error;
    if (data) setCards([...cards, dbCardToCard(data)]);
  };

  const updateCard = async (card: Card) => {
    const { error } = await supabase
      .from('cards')
      .update({
        title: card.title,
        description: card.description,
        labels: card.labels ?? [],
        due_date: card.dueDate,
        attachment_count: card.attachmentCount,
        comment_count: card.commentCount
      })
      .eq('id', card.id);

    if (error) throw error;
    setCards(cards.map(c => c.id === card.id ? card : c));
  };

  const moveCard = async (cardId: string, newColumnId: string) => {
    const { error } = await supabase
      .from('cards')
      .update({ column_id: newColumnId })
      .eq('id', cardId);

    if (error) throw error;
    setCards(cards.map(c => c.id === cardId ? { ...c, columnId: newColumnId } : c));
  };

  const deleteCard = async (cardId: string) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId);

    if (error) throw error;
    setCards(cards.filter(c => c.id !== cardId));
  };

  const archiveCard = async (cardId: string) => {
    const { error } = await supabase
      .from('cards')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', cardId);

    if (error) throw error;

    const cardToArchive = cards.find(c => c.id === cardId);
    if (cardToArchive) {
      setCards(cards.filter(c => c.id !== cardId));
      setArchivedCards([...archivedCards, { ...cardToArchive, archivedAt: new Date().toISOString() }]);
    }
  };

  const restoreCard = async (cardId: string) => {
    const { error } = await supabase
      .from('cards')
      .update({ archived_at: null })
      .eq('id', cardId);

    if (error) throw error;

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
