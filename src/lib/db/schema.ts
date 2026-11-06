import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  mysqlEnum,
  decimal,
} from 'drizzle-orm/mysql-core';

/**
 * Esquema de base de datos — CRM Recórcholis
 * Tablas: users (autenticación + roles) y leads (prospectos B2B/B2C).
 */

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['ADMIN', 'EDITOR', 'VIEWER']).notNull().default('VIEWER'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const leads = mysqlTable('leads', {
  id: varchar('id', { length: 36 }).primaryKey(),
  type: mysqlEnum('type', ['INFANTIL', 'ESCOLAR', 'CORPORATIVO']).notNull(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 160 }),
  eventDate: varchar('event_date', { length: 10 }),
  guests: int('guests'),
  venueId: varchar('venue_id', { length: 36 }),
  budget: decimal('budget', { precision: 10, scale: 2 }),
  message: text('message'),
  status: mysqlEnum('status', ['NUEVO', 'CONTACTADO', 'COTIZADO', 'GANADO', 'PERDIDO'])
    .notNull()
    .default('NUEVO'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
