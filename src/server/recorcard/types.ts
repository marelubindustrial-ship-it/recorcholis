/**
 * Contratos del dominio Recorcard.
 * El patrón Repository aísla la lógica externa del procesador de pagos:
 * cualquier adaptador (HTTP real, mock, sandbox) implementa RecorcardGateway.
 */

export interface RecorcardBalance {
  cardNumber: string;
  holder: string;
  balance: number; // en MXN
  points: number;
  lastTopUp: string | null;
}

export interface TopUpRequest {
  cardNumber: string;
  amount: number; // MXN, debe estar en ALLOWED_TOPUP_AMOUNTS
  paymentMethod: 'CARD' | 'PAYPAL' | 'OXXO';
  idempotencyKey: string;
}

export interface TopUpResult {
  transactionId: string;
  cardNumber: string;
  amount: number;
  newBalance: number;
  status: 'APPROVED' | 'PENDING' | 'DECLINED';
}

export class RecorcardError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'CARD_NOT_FOUND'
      | 'INVALID_AMOUNT'
      | 'PROVIDER_UNAVAILABLE'
      | 'DECLINED',
  ) {
    super(message);
    this.name = 'RecorcardError';
  }
}

export const ALLOWED_TOPUP_AMOUNTS = [100, 200, 300, 500, 1000] as const;

export interface RecorcardGateway {
  getBalance(cardNumber: string): Promise<RecorcardBalance>;
  topUp(request: TopUpRequest): Promise<TopUpResult>;
}
