// WhatsApp notification utilities

export interface WhatsAppMessage {
  to: string;
  message: string;
}

/**
 * Generates a WhatsApp link with pre-filled message
 */
export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove all non-numeric characters except +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Notification when a guide submits a new listing
 */
export function createNewListingNotification(params: {
  category: string;
  title: string;
  price: string;
  currency: string;
  guideName: string;
  guidePhone: string;
  therapyId: string;
  adminUrl: string;
}): string {
  const reviewUrl = `${params.adminUrl}/admin/master/therapies/edit/${params.therapyId}`;
  
  return `🆕 *Nueva Publicación Pendiente de Aprobación*

📂 Categoría: ${params.category}
📝 Título: ${params.title}
💰 Precio: ${params.currency} ${params.price}
👤 Guía: ${params.guideName}
📞 Contacto del Guía: ${params.guidePhone}

🔗 Revisar y aprobar aquí:
${reviewUrl}

Por favor revisa esta publicación en el panel de administración.`;
}

/**
 * Notification when a guide updates an existing listing
 */
export function createUpdateListingNotification(params: {
  category: string;
  title: string;
  price: string;
  currency: string;
  guideName: string;
  guidePhone: string;
  therapyId: string;
  adminUrl: string;
}): string {
  const reviewUrl = `${params.adminUrl}/admin/master/therapies/edit/${params.therapyId}`;
  
  return `✏️ *Publicación Actualizada - Requiere Revisión*

📂 Categoría: ${params.category}
📝 Título: ${params.title}
💰 Precio: ${params.currency} ${params.price}
👤 Guía: ${params.guideName}
📞 Contacto del Guía: ${params.guidePhone}

🔗 Revisar cambios aquí:
${reviewUrl}

Por favor revisa los cambios realizados en esta publicación.`;
}

/**
 * Notification when a customer makes a reservation
 */
export function createReservationNotification(params: {
  therapyTitle: string;
  category: string;
  date?: string;
  price: string;
  currency: string;
  guideName: string;
  guidePhone: string;
  guideWhatsapp?: string;
}): string {
  const whatsappLink = params.guideWhatsapp 
    ? `\n📱 WhatsApp Guía: https://wa.me/${params.guideWhatsapp.replace(/[^\d+]/g, '')}`
    : '';

  return `🎯 *Nueva Reserva de Cliente*

${params.category === 'ceremonias' ? '🌿' : params.category === 'terapias' ? '💆' : '📅'} ${params.therapyTitle}
📂 Categoría: ${params.category}
${params.date ? `📅 Fecha: ${params.date}` : ''}
💰 Precio: ${params.currency} ${params.price}

*Información del Guía:*
👤 ${params.guideName}
📞 ${params.guidePhone}${whatsappLink}

Contacta al guía para coordinar los detalles de la reserva.`;
}

/**
 * Notification when a customer wants to purchase a product
 */
export function createPurchaseNotification(params: {
  productTitle: string;
  category: string;
  price: string;
  currency: string;
  guideName: string;
  guidePhone: string;
  guideWhatsapp?: string;
  inventory?: number;
}): string {
  const whatsappLink = params.guideWhatsapp 
    ? `\n📱 WhatsApp Vendedor: https://wa.me/${params.guideWhatsapp.replace(/[^\d+]/g, '')}`
    : '';

  return `🛒 *Nueva Solicitud de Compra*

${params.category === 'productos' ? '📦' : params.category === 'medicina' ? '💊' : '🌱'} ${params.productTitle}
📂 Categoría: ${params.category}
💰 Precio: ${params.currency} ${params.price}
${params.inventory !== undefined ? `📊 Stock: ${params.inventory} unidades` : ''}

*Información del Vendedor:*
👤 ${params.guideName}
📞 ${params.guidePhone}${whatsappLink}

Contacta al vendedor para coordinar la compra.`;
}

/**
 * Notification when a customer registers for an event
 */
export function createEventRegistrationNotification(params: {
  eventTitle: string;
  date?: string;
  price: string;
  currency: string;
  guideName: string;
  guidePhone: string;
  guideWhatsapp?: string;
}): string {
  const whatsappLink = params.guideWhatsapp 
    ? `\n📱 WhatsApp Organizador: https://wa.me/${params.guideWhatsapp.replace(/[^\d+]/g, '')}`
    : '';

  return `🎉 *Nueva Inscripción a Evento*

📅 ${params.eventTitle}
${params.date ? `🗓️ Fecha: ${params.date}` : ''}
💰 Precio: ${params.currency} ${params.price}

*Información del Organizador:*
👤 ${params.guideName}
📞 ${params.guidePhone}${whatsappLink}

Contacta al organizador para confirmar la inscripción.`;
}
