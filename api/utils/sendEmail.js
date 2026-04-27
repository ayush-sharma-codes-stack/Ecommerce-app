import nodemailer from 'nodemailer';

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendWelcomeEmail = async ({ name, email }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"ShopElite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to ShopElite! 🎉',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0f0f1a;color:#e2e8f0;border-radius:12px;">
        <h1 style="color:#a78bfa;">Welcome, ${name}! 🛍️</h1>
        <p>Thank you for joining <strong>ShopElite</strong> — your premium shopping destination.</p>
        <p>Explore thousands of products and enjoy a seamless shopping experience.</p>
        <a href="${process.env.CLIENT_URL}" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Start Shopping
        </a>
        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">If you did not register, ignore this email.</p>
      </div>
    `,
  });
};

export const sendOrderConfirmationEmail = async ({ email, name, order }) => {
  const transporter = createTransporter();
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #1e1e3a;">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #1e1e3a;text-align:center;">${i.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #1e1e3a;text-align:right;">$${(i.price * i.qty).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  await transporter.sendMail({
    from: `"ShopElite" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmed! #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0f0f1a;color:#e2e8f0;border-radius:12px;">
        <h1 style="color:#a78bfa;">Order Confirmed! ✅</h1>
        <p>Hi <strong>${name}</strong>, your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-6).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <thead>
            <tr style="background:#1e1e3a;">
              <th style="padding:8px;text-align:left;">Product</th>
              <th style="padding:8px;text-align:center;">Qty</th>
              <th style="padding:8px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="margin-top:16px;font-size:18px;font-weight:bold;">
          Total: <span style="color:#a78bfa;">$${order.totalAmount.toFixed(2)}</span>
        </p>
        <a href="${process.env.CLIENT_URL}/orders/${order._id}" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
          Track Order
        </a>
      </div>
    `,
  });
};
