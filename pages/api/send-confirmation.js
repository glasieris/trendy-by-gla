import { Resend } from 'resend';
import supabaseAdmin from '../../lib/supabaseAdmin';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    orderNum, customerName, customerPhone,
    payment, deliveryType, deliveryLabel, deliveryInfo,
    items, subtotal, deliveryCost, gift, giftMsg, grand, bcvRate,
  } = req.body;

  if (!orderNum || !items?.length) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const storeEmail = 'trendybyglas@gmail.com';
  const fromEmail = 'pedidos@trendybygla.com';
  const grandBs = (grand * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 });

  // Build product rows for email tables
  const itemsRows = items.map(item => `
    <tr>
      <td style="padding:8px 4px;border-bottom:1px solid #fce7f3;font-size:14px;">
        ${item.name}${item.color ? ` <span style="color:#9ca3af;">(${item.color})</span>` : ''}
        ${item.isMayor ? ' <span style="background:#dcfce7;color:#166534;font-size:11px;padding:1px 6px;border-radius:10px;">Mayor ✓</span>' : ''}
      </td>
      <td style="padding:8px 4px;border-bottom:1px solid #fce7f3;text-align:center;font-size:14px;">x${item.qty}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #fce7f3;text-align:right;color:#E91E8C;font-weight:bold;font-size:14px;">$${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  // Build delivery section
  let deliveryHtml = '';
  if (deliveryType === 'local') {
    deliveryHtml = `
      <p style="margin:4px 0;"><strong>Zona:</strong> ${deliveryInfo.zone}</p>
      <p style="margin:4px 0;"><strong>Recibe:</strong> ${deliveryInfo.receiver}</p>
      <p style="margin:4px 0;"><strong>Dirección:</strong> ${deliveryInfo.address}</p>
      ${deliveryInfo.schedule ? `<p style="margin:4px 0;"><strong>Horario:</strong> ${deliveryInfo.schedule}</p>` : ''}
    `;
  } else if (deliveryType === 'nacional') {
    deliveryHtml = `
      <p style="margin:4px 0;"><strong>Agencia:</strong> ${deliveryInfo.courier}</p>
      <p style="margin:4px 0;"><strong>Destinatario:</strong> ${deliveryInfo.destName}</p>
      <p style="margin:4px 0;"><strong>Cédula:</strong> ${deliveryInfo.cedula}</p>
      <p style="margin:4px 0;"><strong>Teléfono:</strong> ${deliveryInfo.destPhone}</p>
      <p style="margin:4px 0;"><strong>Dirección agencia:</strong> ${deliveryInfo.agencyAddr}</p>
      <p style="margin:4px 0;color:#92400e;"><strong>⚠️ Cobro a destino</strong></p>
    `;
  } else {
    deliveryHtml = '<p style="margin:4px 0;">Retiro en tienda (previa cita, Lunes–Viernes 10am–5pm).</p>';
  }

  // ===== CUSTOMER CONFIRMATION EMAIL =====
  const customerHtml = `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background:#FDE4F0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(233,30,140,0.12);">
    <tr>
      <td style="background:linear-gradient(135deg,#E91E8C 0%,#D81B60 100%);padding:36px 32px;text-align:center;">
        <p style="margin:0;color:rgba(255,255,255,0.85);font-size:14px;letter-spacing:2px;text-transform:uppercase;">Trendy by Gla Accesorios</p>
        <h1 style="margin:8px 0 4px;color:#ffffff;font-size:28px;font-weight:800;">¡Pedido Confirmado!</h1>
        <p style="margin:0;color:rgba(255,255,255,0.9);font-size:15px;">Gracias por tu compra 💕</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px 0;">
        <div style="background:#fdf2f8;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
          <p style="margin:0;color:#E91E8C;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Número de Pedido</p>
          <p style="margin:6px 0 0;color:#E91E8C;font-size:26px;font-weight:800;">#${orderNum}</p>
        </div>
        <p style="color:#374151;font-size:15px;">Hola <strong>${customerName}</strong>,</p>
        <p style="color:#6b7280;font-size:14px;line-height:1.6;">Hemos recibido tu pedido exitosamente. En breve te contactaremos por WhatsApp al <strong>${customerPhone}</strong> para coordinar el pago y la entrega.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;">
        <h3 style="color:#E91E8C;font-size:15px;font-weight:700;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #fce7f3;">📋 Resumen del Pedido</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#fdf2f8;">
              <th style="padding:8px 4px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Producto</th>
              <th style="padding:8px 4px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Cant.</th>
              <th style="padding:8px 4px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
          <tr><td style="padding:4px 4px;color:#6b7280;font-size:14px;">Subtotal</td><td style="padding:4px 4px;text-align:right;font-size:14px;">$${subtotal.toFixed(2)}</td></tr>
          ${deliveryCost > 0 ? `<tr><td style="padding:4px 4px;color:#6b7280;font-size:14px;">Delivery</td><td style="padding:4px 4px;text-align:right;font-size:14px;">$${deliveryCost.toFixed(2)}</td></tr>` : ''}
          ${gift ? `<tr><td style="padding:4px 4px;color:#6b7280;font-size:14px;">Empaque regalo</td><td style="padding:4px 4px;text-align:right;font-size:14px;">$1.00</td></tr>` : ''}
          <tr>
            <td style="padding:12px 4px 4px;border-top:2px solid #fce7f3;color:#E91E8C;font-weight:700;font-size:15px;">TOTAL</td>
            <td style="padding:12px 4px 4px;border-top:2px solid #fce7f3;text-align:right;color:#E91E8C;font-weight:800;font-size:20px;">$${grand.toFixed(2)}</td>
          </tr>
          <tr><td colspan="2" style="padding:2px 4px;text-align:right;color:#9ca3af;font-size:12px;">≈ ${grandBs} Bs (BCV ${bcvRate})</td></tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 20px;">
        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px;">
          <h4 style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:700;">🚚 Método de Entrega</h4>
          <p style="margin:0 0 8px;color:#E91E8C;font-weight:600;font-size:14px;">${deliveryLabel}</p>
          <div style="color:#6b7280;font-size:13px;">${deliveryHtml}</div>
        </div>
        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px;">
          <h4 style="margin:0 0 6px;color:#374151;font-size:14px;font-weight:700;">💳 Método de Pago</h4>
          <p style="margin:0;color:#6b7280;font-size:14px;">${payment}</p>
        </div>
        ${gift && giftMsg ? `<div style="background:#fdf2f8;border-radius:12px;padding:16px;margin-bottom:16px;"><p style="margin:0 0 6px;color:#E91E8C;font-weight:700;font-size:14px;">🎁 Tarjeta de regalo</p><p style="margin:0;color:#374151;font-size:14px;">${giftMsg}</p></div>` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 28px;">
        <div style="background:linear-gradient(135deg,#fdf2f8,#fce7f3);border-radius:12px;padding:20px;text-align:center;">
          <p style="margin:0 0 12px;color:#E91E8C;font-weight:700;font-size:15px;">📌 Próximos Pasos</p>
          <p style="margin:0 0 8px;color:#374151;font-size:13px;">1. Revisa este email con el detalle de tu pedido.</p>
          <p style="margin:0 0 8px;color:#374151;font-size:13px;">2. Te contactaremos por WhatsApp para confirmar el pago.</p>
          <p style="margin:0;color:#374151;font-size:13px;">3. ¡Preparamos tu pedido y te lo hacemos llegar! 💕</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #fce7f3;">
        <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">© 2026 Trendy by Gla Accesorios · @Trendybygla</p>
        <p style="margin:0;color:#9ca3af;font-size:12px;">Tel: 0422-8736390 · trendybygla.com</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // ===== STORE NOTIFICATION EMAIL =====
  const storeHtml = `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:#1F2937;padding:24px 28px;text-align:center;">
        <p style="margin:0;color:#E91E8C;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Nuevo Pedido Recibido</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:24px;font-weight:800;">#${orderNum}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px;">
        <h3 style="color:#374151;font-size:14px;font-weight:700;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">👤 Datos del Cliente</h3>
        <p style="margin:4px 0;font-size:14px;"><strong>Nombre:</strong> ${customerName}</p>
        <p style="margin:4px 0;font-size:14px;"><strong>Teléfono:</strong> ${customerPhone}</p>
        <p style="margin:4px 0;font-size:14px;"><strong>Pago:</strong> ${payment}</p>

        <h3 style="color:#374151;font-size:14px;font-weight:700;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">📋 Productos</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:8px 4px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">Producto</th>
              <th style="padding:8px 4px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">Cant.</th>
              <th style="padding:8px 4px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;font-weight:800;color:#E91E8C;margin:12px 0 4px;">TOTAL: $${grand.toFixed(2)} USD</p>
        <p style="text-align:right;color:#9ca3af;font-size:13px;margin:0;">≈ ${grandBs} Bs (BCV ${bcvRate})</p>

        <h3 style="color:#374151;font-size:14px;font-weight:700;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">🚚 Entrega: ${deliveryLabel}</h3>
        <div style="color:#374151;font-size:14px;">${deliveryHtml}</div>

        ${gift ? `<p style="margin:16px 0 4px;font-size:14px;"><strong>🎁 Empaque regalo</strong>${giftMsg ? `: "${giftMsg}"` : ''}</p>` : ''}
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;padding:16px 28px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Trendy by Gla — Panel de Pedidos · trendybygla.com</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    // Save order to Supabase (fire and forget — don't block email on DB failure)
    supabaseAdmin.from('orders').insert({
      order_num: orderNum,
      customer_name: customerName,
      customer_phone: customerPhone,
      payment,
      delivery_type: deliveryType,
      delivery_label: deliveryLabel,
      delivery_info: deliveryInfo || {},
      items,
      subtotal,
      delivery_cost: deliveryCost,
      gift: !!gift,
      gift_msg: giftMsg || null,
      grand,
      status: 'nuevo',
    }).then(({ error }) => { if (error) console.error('Supabase order save error:', error) });

    await resend.emails.send({
      from: fromEmail,
      to: storeEmail,
      subject: `🛍️ Nuevo pedido #${orderNum} — ${customerName} ($${grand.toFixed(2)})`,
      html: storeHtml,
    });

    return res.status(200).json({ success: true, orderNum });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Error al enviar el email de confirmación' });
  }
}
