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
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND + '/api/sendemail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: email.subject,
        body: email.body,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return Promise.resolve();
  } catch(e) {
    console.error('error', e);
    
    return Promise.reject();
  }
}

