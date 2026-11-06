import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { leadSchema } from '@/lib/validators/leads';
import { getLeadsRepository } from '@/server/leads/repository';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const repo = await getLeadsRepository();
  const lead = await repo.create({
    ...parsed.data,
    company: parsed.data.company || null,
    message: parsed.data.message || null,
    budget: parsed.data.budget != null ? String(parsed.data.budget) : null,
  });

  return NextResponse.json({ id: lead.id, status: lead.status }, { status: 201 });
}

export async function GET(request: NextRequest) {
  // Solo sesiones autenticadas con rol administrativo pueden listar prospectos.
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || (token.role !== 'ADMIN' && token.role !== 'EDITOR')) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const repo = await getLeadsRepository();
  const leads = await repo.list();
  return NextResponse.json(leads);
}
