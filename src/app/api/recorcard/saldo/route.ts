import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRecorcardGateway } from '@/server/recorcard/gateway';
import { RecorcardError } from '@/server/recorcard/types';

const querySchema = z.object({
  card: z.string().regex(/^\d{12,19}$/, 'Número de tarjeta inválido.'),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ card: searchParams.get('card') ?? '' });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const gateway = createRecorcardGateway();
    const balance = await gateway.getBalance(parsed.data.card);
    return NextResponse.json(balance);
  } catch (error) {
    if (error instanceof RecorcardError) {
      const status = error.code === 'CARD_NOT_FOUND' ? 404 : 502;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
