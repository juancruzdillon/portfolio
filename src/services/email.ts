/**
 * Represents the structure of an email message.
 */
export interface Email {
  /**
   * The subject of the email.
   */
  subject: string;
  /**
   * The body of the email, which can contain HTML content.
   */
  body: string;
}

/**
 * Asynchronously sends an email message.
 *
 * @param email The email object containing subject and body.
 * @returns A promise that resolves when the email is successfully sent.
 */
export async function sendEmail(email: Email): Promise<void> {
  // TODO: Implement this by calling an email sending API.
  // The `to` and `from` fields would typically be configured on the server-side
  // or in environment variables for a real email service.
  console.log("Sending email with subject:", email.subject, "and body:", email.body);
  // For a real implementation, you'd use a service like SendGrid, Nodemailer, etc.
  // Example (conceptual):
  // const response = await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     to: 'juancruzdillon1999@gmail.com', // Hardcoded or from env var
  //     from: 'noreply@yourdomain.com', // Hardcoded or from env var, or use userEmail as Reply-To
  //     subject: email.subject,
  //     textBody: email.body, // if plain text
  //     // htmlBody: `<p>${email.body.replace(/\n/g, '<br>')}</p>` // if HTML
  //   }),
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to send email');
  // }
  return Promise.resolve();
}

