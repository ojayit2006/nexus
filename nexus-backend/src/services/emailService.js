const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: (process.env.SMTP_PORT == 465), // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send a generic email
 */
async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: '"Nexus Clearance" <noreply@antigravity.edu>',
      to,
      subject,
      html
    });
    logger.info(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return false; // Do not throw, just log
  }
}

/**
 * Send specific status update emails
 */
async function sendStatusUpdateEmail(studentEmail, studentName, newStatus) {
  if (!studentEmail) return;

  const statusConfigs = {
    hod_pending: {
      subject: "Lab clearance approved — HOD review next",
      body: `Hi ${studentName},<br><br>Good news! Your lab clearance has been approved. Your application has now moved to the <b>HOD review stage</b>.`
    },
    principal_pending: {
      subject: "HOD approved — Principal review next",
      body: `Hi ${studentName},<br><br>Your HOD has approved your clearance. Your application is now awaiting <b>final Principal sign-off</b>.`
    },
    approved: {
      subject: "Congratulations! Your clearance is fully approved",
      body: `Hi ${studentName},<br><br><b>Congratulations!</b> Your clearance application has been fully approved by all departments. You can now download your digital certificate from the dashboard.`
    },
    rejected: {
      subject: "Clearance application rejected",
      body: `Hi ${studentName},<br><br>We regret to inform you that your clearance application has been <b>rejected</b>. Please check the dashboard for comments or contact your department for more details.`
    }
  };

  const config = statusConfigs[newStatus];
  if (!config) return;

  return await sendEmail({
    to: studentEmail,
    subject: config.subject,
    html: config.body
  });
}

module.exports = {
  sendEmail,
  sendStatusUpdateEmail
};
