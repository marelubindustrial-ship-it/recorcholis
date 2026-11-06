import { randomUUID } from 'crypto';
import { desc } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { Lead, NewLead } from '@/lib/db/schema';

/**
 * Repository de leads con fallback en memoria cuando no hay DATABASE_URL.
 * La interfaz es estable: cambiar de MySQL a PostgreSQL no toca a los
 * consumidores (API routes, CRM).
 */
export interface LeadsRepository {
  create(input: Omit<NewLead, 'id' | 'createdAt' | 'status'>): Promise<Lead>;
  list(): Promise<Lead[]>;
}

class InMemoryLeadsRepository implements LeadsRepository {
  private rows: Lead[] = [
    {
      id: randomUUID(),
      type: 'INFANTIL',
      fullName: 'Mariana Solís',
      email: 'mariana@example.com',
      phone: '+525512345678',
      company: null,
      eventDate: '2026-12-05',
      guests: 40,
      venueId: 'coapa',
      budget: '15000.00',
      message: 'Cumpleaños de 7 años, temática arcade.',
      status: 'NUEVO',
      createdAt: new Date(),
    },
    {
      id: randomUUID(),
      type: 'CORPORATIVO',
      fullName: 'Diego Ferrer',
      email: 'dferrer@example.com',
      phone: '+525587654321',
      company: 'Grupo Ferrer',
      eventDate: '2026-12-18',
      guests: 120,
      venueId: 'santa-fe',
      budget: '85000.00',
      message: 'Fiesta de fin de año con torneo de videojuegos.',
      status: 'CONTACTADO',
      createdAt: new Date(),
    },
  ];

  async create(input: Omit<NewLead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
    const lead: Lead = {
      id: randomUUID(),
      createdAt: new Date(),
      status: 'NUEVO',
      type: input.type,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      company: input.company ?? null,
      eventDate: input.eventDate ?? null,
      guests: input.guests ?? null,
      venueId: input.venueId ?? null,
      budget: input.budget ?? null,
      message: input.message ?? null,
    };
    this.rows.unshift(lead);
    return lead;
  }

  async list(): Promise<Lead[]> {
    return this.rows;
  }
}

class DrizzleLeadsRepository implements LeadsRepository {
  async create(input: Omit<NewLead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
    const db = await getDb();
    if (!db) throw new Error('DB no disponible');
    const result = await db.insert(schema.leads).values({
      ...input,
      id: randomUUID(),
    });
    return { id: String(result[0].insertId), createdAt: new Date(), status: 'NUEVO', ...input } as Lead;
  }

  async list(): Promise<Lead[]> {
    const db = await getDb();
    if (!db) throw new Error('DB no disponible');
    return db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
  }
}

export async function getLeadsRepository(): Promise<LeadsRepository> {
  return process.env.DATABASE_URL
    ? new DrizzleLeadsRepository()
    : new InMemoryLeadsRepository();
}
