// Beauty service categories
export const SERVICE_CATEGORIES = {
  HAIR: 'Coiffure',
  MAKEUP: 'Maquillage',
  MASSAGE: 'Massage',
  FACIAL: 'Soin visage',
  SKIN: 'Soin de peau',
  MANICURE: 'Manicure',
  PEDICURE: 'Pédicure',
  ADVICE: 'Conseils beauté',
  BODY_SCRUB: 'Gommage corps'
} as const;

// Product categories
export const PRODUCT_CATEGORIES = {
  HAIR_CARE: 'Soins capillaires',
  BODY_CARE: 'Soins du corps',
  ESSENTIAL_OILS: 'Huiles essentielles',
  FACE_CARE: 'Soins du visage',
  MAKEUP: 'Maquillage',
  ACCESSORIES: 'Accessoires'
} as const;

// Appointment status
export const APPOINTMENT_STATUS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé'
} as const;

// Order status
export const ORDER_STATUS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée'
} as const;

// User roles
export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
  BEAUTICIAN: 'beautician'
} as const;