import {
  RecorcardGateway,
  RecorcardBalance,
  TopUpRequest,
  TopUpResult,
  RecorcardError,
  ALLOWED_TOPUP_AMOUNTS,
} from '../types';

/**
 * Adaptador HTTP de producción contra la API real de Recorcard.
 * Se activa cuando existen RECORCARD_API_BASE / RECORCARD_API_KEY.
 */
export class HttpRecorcardAdapter implements RecorcardGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly merchantId: string,
  ) {}

  async getBalance(cardNumber: string): Promise<RecorcardBalance> {
    const res = await fetch(`${this.baseUrl}/v1/cards/${cardNumber}/balance`, {
      headers: this.headers(),
      next: { revalidate: 0 },
    });
    if (res.status === 404) throw new RecorcardError('Tarjeta no encontrada.', 'CARD_NOT_FOUND');
    if (!res.ok) throw new RecorcardError('Proveedor no disponible.', 'PROVIDER_UNAVAILABLE');
    return res.json();
  }

  async topUp(request: TopUpRequest): Promise<TopUpResult> {
    if (!(ALLOWED_TOPUP_AMOUNTS as readonly number[]).includes(request.amount)) {
      throw new RecorcardError('Monto no permitido.', 'INVALID_AMOUNT');
    }
    const res = await fetch(`${this.baseUrl}/v1/topups`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ ...request, merchantId: this.merchantId }),
    });
    if (res.status === 409) {
      // Idempotencia: la transacción ya existe, la recuperamos.
      const dup = await fetch(`${this.baseUrl}/v1/topups/${request.idempotencyKey}`, {
        headers: this.headers(),
      });
      return dup.json();
    }
    if (!res.ok) throw new RecorcardError('Pago rechazado.', 'DECLINED');
    return res.json();
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }
}
