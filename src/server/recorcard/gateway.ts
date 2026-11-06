import { RecorcardGateway } from './types';
import { HttpRecorcardAdapter } from './adapters/http-recorcard.adapter';
import { MockRecorcardAdapter } from './adapters/mock-recorcard.adapter';

/**
 * Factoría del gateway: inyección de dependencias por configuración.
 * - Con credenciales RECORCARD_* → adaptador HTTP de producción.
 * - Sin credenciales → adaptador sandbox/demo.
 *
 * Para integrar un nuevo procesador (Stripe, Conekta, Mercado Pago),
 * basta con crear otro adaptador que implemente RecorcardGateway.
 */
export function createRecorcardGateway(): RecorcardGateway {
  const { RECORCARD_API_BASE, RECORCARD_API_KEY, RECORCARD_MERCHANT_ID } = process.env;
  if (RECORCARD_API_BASE && RECORCARD_API_KEY && RECORCARD_MERCHANT_ID) {
    return new HttpRecorcardAdapter(RECORCARD_API_BASE, RECORCARD_API_KEY, RECORCARD_MERCHANT_ID);
  }
  return new MockRecorcardAdapter();
}
