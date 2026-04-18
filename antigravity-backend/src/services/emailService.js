import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send clearance status update email
 */
export const sendStatusUpdateEmail = async (to, studentName, newStatus) => {
  try {
    const info = await transporter.sendMail({
      from: '"Antigravity Clearance" <no-reply@antigravity.edu>',
      to,
      subject: `Clearance Update: ${newStatus.replace('_', ' ').toUpperCase()}`,
      text: `Hello ${studentName}, your clearance application status has been updated to: ${newStatus}.`,
      html: `<p>Hello <b>${studentName}</b>,</p><p>Your clearance application status has been updated to: <b>${newStatus.replace('_', ' ').toUpperCase()}</b>.</p>`
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error(`Email delivery failed: ${error.message}`);
  }
};
