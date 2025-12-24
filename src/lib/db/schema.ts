import { pgTable, uuid, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const columns = pgTable('columns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  color: text('color').notNull().default('#0ea5e9'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow()
});

export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  columnId: uuid('column_id').notNull().references(() => columns.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  labels: text('labels').array().default([]),
  dueDate: timestamp('due_date'),
  order: integer('order').notNull().default(0),
  attachmentCount: integer('attachment_count').default(0),
  commentCount: integer('comment_count').default(0),
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  author: text('author').notNull(),
  authorInitials: text('author_initials'),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  cardId: uuid('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'file' | 'link'
  url: text('url'),
  size: text('size'),
  createdAt: timestamp('created_at').defaultNow()
});

// Types
export type DbColumn = typeof columns.$inferSelect;
export type DbCard = typeof cards.$inferSelect;
export type DbComment = typeof comments.$inferSelect;
export type DbAttachment = typeof attachments.$inferSelect;
