import { z } from 'zod';

export const leadStepOneSchema = z.object({
  type: z.enum(['INFANTIL', 'ESCOLAR', 'CORPORATIVO']),
  fullName: z.string().min(3, 'Ingresa tu nombre completo.').max(120),
  email: z.string().email('Correo inválido.'),
  phone: z
    .string()
    .regex(/^\+?\d{8,15}$/, 'Teléfono inválido (8–15 dígitos).'),
});

export const leadStepTwoSchema = z.object({
  eventDate: z.string().min(8, 'Selecciona una fecha.'),
  guests: z.coerce.number().int().min(10, 'Mínimo 10 invitados.').max(2000),
  venueId: z.string().min(1, 'Elige una sucursal.'),
});

export const leadStepThreeSchema = z.object({
  company: z.string().max(160).optional().or(z.literal('')),
  budget: z.coerce.number().min(0).optional(),
  message: z.string().max(1000).optional().or(z.literal('')),
});

export const leadSchema = leadStepOneSchema
  .merge(leadStepTwoSchema)
  .merge(leadStepThreeSchema);

export type LeadInput = z.infer<typeof leadSchema>;
