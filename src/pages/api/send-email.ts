export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

const blockedDomains = ['example.com', 'test.com', 'spam.com', 'fake.com', 'tempmail.com', 'mailinator.com'];
const contactRecipient = 'yaseenzaman1312@proton.me';

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address").max(100, "Email is too long").refine((val) => {
    const domain = val.split('@')[1]?.toLowerCase();
    return Boolean(domain && !blockedDomains.includes(domain));
  }, "Please use a valid email address. Dummy domains are not permitted."),
  subject: z.string().trim().max(150, "Subject is too long").refine(
    (value) => !/[\r\n]/.test(value),
    "Subject contains invalid characters",
  ).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined) || import.meta.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Contact email service is not configured.');
    return jsonResponse({ error: 'Email service is temporarily unavailable.' }, 503);
  }

  try {
    const rawData: unknown = await request.json();
    const parsed = contactSchema.safeParse(rawData);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => i.message).join(", ");
      return jsonResponse({ error: errorMsg }, 400);
    }

    const { name, email, subject, message } = parsed.data;

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = subject ? escapeHtml(subject) : 'N/A';
    const safeMessage = escapeHtml(message);

    const resend = new Resend(apiKey);
    const { data: resendData, error } = await resend.emails.send({
      from: 'Canopryx Contact Form <onboarding@resend.dev>',
      to: [contactRecipient],
      replyTo: email,
      subject: `New Contact Request: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return jsonResponse({ error: 'We could not send your message. Please try again.' }, 502);
    }

    return jsonResponse({ success: true, id: resendData?.id }, 200);
  } catch (error: unknown) {
    console.error('Contact API error:', error);
    return jsonResponse({ error: 'Unable to process your request.' }, 500);
  }
};
