// src/utils/sendgrid.service.ts
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config(); // asegúrate de cargar .env si estás fuera de Nest

const apiKey = process.env.SENDGRID_API_KEY;



sgMail.setApiKey(apiKey || '');

export class SendGridService {
  static async enviarCorreoPedidoEntregado(email: string, nombre: string, resumen: string) {
    const msg = {
      to: email,
      from: 'jsacosta@jdc.edu.co', //  Usa tu correo verificado aquí
      subject: 'Tu pedido ha sido entregado 🍔',
      html: `
        <h1>¡Hola ${nombre}!</h1>
        <p>Te confirmamos que tu pedido ha sido <strong>entregado</strong>.</p>
        <h3>Resumen del pedido:</h3>
        <pre>${resumen}</pre>
        <p>Gracias por tu compra </p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Correo enviado a ${email}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error.response?.body || error);
    }
  }
}
