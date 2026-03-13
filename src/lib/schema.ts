import { z } from "zod"

export const petRegistrationSchema = z.object({
  full_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255),
  whatsapp: z
    .string()
    .min(10, "Ingresa un número de WhatsApp válido")
    .max(15)
    .regex(/^\+?\d{10,15}$/, "Formato de WhatsApp inválido"),
  contact_consent: z.literal(true, {
    error: "Debes autorizar el contacto por WhatsApp",
  }),
  risk_consent: z.literal(true, {
    error: "Debes aceptar la carta de responsabilidad quirúrgica",
  }),
  is_adult: z.literal(true, {
    error: "Debes ser mayor de edad o estar acompañado por un adulto",
  }),
  pet_type: z.enum(["perro", "gato"], {
    error: "Selecciona el tipo de mascota",
  }),
  pet_name: z.string().max(100).optional().default(""),
  is_own_pet: z.boolean(),
})

export type PetRegistrationInput = z.infer<typeof petRegistrationSchema>

export const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const validateQrSchema = z.object({
  qr_token: z.string().uuid(),
})
