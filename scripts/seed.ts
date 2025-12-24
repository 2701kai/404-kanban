import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { columns } from '../src/lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const defaultColumns = [
  { name: 'To Do', color: '#22c55e', order: 0 },
  { name: 'In Progress', color: '#3b82f6', order: 1 },
  { name: 'Done', color: '#a855f7', order: 2 },
];

async function seed() {
  console.log('Seeding database...');

  const insertedColumns = await db.insert(columns).values(defaultColumns).returning();
  console.log(`Inserted ${insertedColumns.length} columns`);

  console.log('Seeding complete!');
}

seed().catch(console.error);
