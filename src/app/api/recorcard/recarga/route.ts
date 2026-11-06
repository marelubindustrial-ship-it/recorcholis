import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createRecorcardGateway } from '@/server/recorcard/gateway';
import { RecorcardError, ALLOWED_TOPUP_AMOUNTS } from '@/server/recorcard/types';

const bodySchema = z.object({
  cardNumber: z.string().regex(/^\d{12,19}$/),
  amount: z.number().int().refine((n) => (ALLOWED_TOPUP_AMOUNTS as readonly number[]).includes(n), {
    message: 'Monto fuera de catálogo.',
  }),
  paymentMethod: z.enum(['CARD', 'PAYPAL', 'OXXO']),
  idempotencyKey: z.string().uuid(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  try {
    const gateway = createRecorcardGateway();
    const result = await gateway.topUp(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof RecorcardError) {
      const status =
        error.code === 'CARD_NOT_FOUND' ? 404 : error.code === 'INVALID_AMOUNT' ? 400 : 502;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
