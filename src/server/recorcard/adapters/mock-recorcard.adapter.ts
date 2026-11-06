import {
  RecorcardGateway,
  RecorcardBalance,
  TopUpRequest,
  TopUpResult,
  RecorcardError,
  ALLOWED_TOPUP_AMOUNTS,
} from '../types';

/**
 * Adaptador sandbox/demo. Simula latencia real de pasarela y
 * rechaza montos fuera de catálogo. Útil para desarrollo y previews.
 */
export class MockRecorcardAdapter implements RecorcardGateway {
  private readonly wallets = new Map<string, RecorcardBalance>([
    ['6012345678901234', { cardNumber: '6012345678901234', holder: 'DEMO FAMILIA', balance: 350, points: 1280, lastTopUp: '2026-10-14' }],
    ['6098765432109876', { cardNumber: '6098765432109876', holder: 'DEMO NIÑO', balance: 75, points: 320, lastTopUp: null }],
  ]);

  async getBalance(cardNumber: string): Promise<RecorcardBalance> {
    await this.latency();
    const wallet = this.wallets.get(cardNumber);
    if (!wallet) throw new RecorcardError('Tarjeta no encontrada.', 'CARD_NOT_FOUND');
    return { ...wallet };
  }

  async topUp(request: TopUpRequest): Promise<TopUpResult> {
    await this.latency(600);
    if (!(ALLOWED_TOPUP_AMOUNTS as readonly number[]).includes(request.amount)) {
      throw new RecorcardError('Monto no permitido.', 'INVALID_AMOUNT');
    }
    const wallet = this.wallets.get(request.cardNumber);
    if (!wallet) throw new RecorcardError('Tarjeta no encontrada.', 'CARD_NOT_FOUND');

    const newBalance = wallet.balance + request.amount;
    this.wallets.set(request.cardNumber, {
      ...wallet,
      balance: newBalance,
      points: wallet.points + Math.floor(request.amount / 10),
      lastTopUp: new Date().toISOString().slice(0, 10),
    });

    return {
      transactionId: `RCP-${request.idempotencyKey.slice(0, 8).toUpperCase()}`,
      cardNumber: request.cardNumber,
      amount: request.amount,
      newBalance,
      status: request.paymentMethod === 'OXXO' ? 'PENDING' : 'APPROVED',
    };
  }

  private latency(ms = 350): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
