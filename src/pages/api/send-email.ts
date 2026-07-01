export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

const blockedDomains = ['example.com', 'test.com', 'spam.com', 'fake.com', 'tempmail.com', 'mailinator.com'];
const personalEmailDomains = [
  'aol.com', 'gmail.com', 'googlemail.com', 'hotmail.com', 'icloud.com',
  'live.com', 'me.com', 'msn.com', 'outlook.com', 'proton.me',
  'protonmail.com', 'yahoo.com', 'ymail.com', 'zoho.com',
];
const defaultContactRecipient = 'contact@canopryx.com';

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
  website: z.string().max(0).optional(),
});

const workEmailSchema = z.email("Enter a valid work email address").max(100, "Email is too long").refine((value) => {
  const domain = value.split('@')[1]?.toLowerCase();
  return Boolean(domain && !blockedDomains.includes(domain) && !personalEmailDomains.includes(domain));
}, "Please use your organization email. Personal and disposable email addresses are not accepted.");

const earlyAccessSchema = z.object({
  formType: z.literal('early-access'),
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: workEmailSchema,
  organization: z.string().trim().min(1, "Organization is required").max(150, "Organization is too long"),
  role: z.string().trim().min(1, "Role is required").max(120, "Role is too long"),
  industry: z.enum(['Defense', 'Fintech', 'Healthcare', 'Government', 'Critical infrastructure', 'Enterprise technology', 'Other']),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1,000', '1,001+']),
  secretsSetup: z.enum(['None / manual processes', 'Environment files', 'Cloud-provider secrets service', 'Third-party SaaS', 'Self-hosted solution', 'Mixed environment', 'Other']),
  protectionGoals: z.string().trim().min(1, "Protection goals are required").max(2000, "Protection goals are too long"),
  message: z.string().trim().max(2000, "Additional message is too long").optional(),
  website: z.string().max(0).optional(),
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

function renderContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `<!doctype html>
  <html>
    <body style="margin:0;background:#f2f4f3;color:#17221c;">
      <div style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;margin:0 auto;border-collapse:collapse;">
          <tr>
            <td style="padding:0 0 18px;font:700 13px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#1f6f55;">
              Canopryx
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #dfe5e1;border-top:4px solid #173f31;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:30px 32px 24px;border-bottom:1px solid #e5e9e7;">
                    <div style="margin-bottom:8px;font:700 11px/1 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#607068;">Website inquiry</div>
                    <h1 style="margin:0;font:600 25px/1.3 Georgia,'Times New Roman',serif;color:#17221c;">${subject}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="width:92px;padding:20px 16px 16px 0;border-bottom:1px solid #edf0ee;vertical-align:top;font:700 11px/1.5 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#718078;">From</td>
                        <td style="padding:17px 0 16px;border-bottom:1px solid #edf0ee;font:600 15px/1.6 Arial,sans-serif;color:#17221c;">${name}</td>
                      </tr>
                      <tr>
                        <td style="width:92px;padding:16px 16px 16px 0;border-bottom:1px solid #edf0ee;vertical-align:top;font:700 11px/1.5 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#718078;">Email</td>
                        <td style="padding:13px 0 16px;border-bottom:1px solid #edf0ee;font:500 15px/1.6 Arial,sans-serif;word-break:break-word;">
                          <a href="mailto:${email}" style="color:#1f6f55;text-decoration:underline;">${email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 34px;">
                    <div style="margin-bottom:13px;font:700 11px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#607068;">Message</div>
                    <div style="font:400 16px/1.75 Arial,sans-serif;color:#26342d;white-space:pre-wrap;">${message}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 2px 0;font:400 12px/1.6 Arial,sans-serif;color:#718078;">
              Reply to this email to respond to ${name}.
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>`;
}

function renderEarlyAccessEmail({
  name, email, organization, role, industry, companySize, secretsSetup, protectionGoals, message,
}: {
  name: string; email: string; organization: string; role: string; industry: string;
  companySize: string; secretsSetup: string; protectionGoals: string; message: string;
}) {
  const detail = (label: string, value: string) => `
    <td style="width:50%;padding:0 8px 16px;vertical-align:top;">
      <div style="height:100%;padding:17px 18px;background:#f4f8f6;border:1px solid #e1ebe5;border-radius:14px;">
        <div style="margin-bottom:8px;font:700 10px/1.2 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#587065;">${label}</div>
        <div style="font:600 15px/1.5 Arial,sans-serif;color:#14261c;word-break:break-word;">${value}</div>
      </div>
    </td>`;

  return `<!doctype html>
  <html><body style="margin:0;background:#edf3ef;color:#14261c;">
    <div style="padding:36px 16px;background:linear-gradient(145deg,#edf3ef 0%,#f8fbf9 52%,#e7f1ed 100%);">
      <div style="max-width:700px;margin:0 auto;">
        <div style="margin:0 0 14px 4px;font:700 11px/1 Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#2a6f7e;">Canopryx / Private preview</div>
        <div style="overflow:hidden;background:#fff;border:1px solid #dde8e2;border-radius:24px;box-shadow:0 18px 45px rgba(20,38,28,.09);">
          <div style="padding:34px;background:#13241b;background-image:linear-gradient(125deg,#13241b 0%,#174e3a 100%);">
            <div style="font:700 11px/1 Arial,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#78c49a;">New early access request</div>
            <h1 style="margin:12px 0 0;font:700 30px/1.15 Arial,sans-serif;color:#fff;">${organization}</h1>
            <p style="margin:10px 0 0;font:400 15px/1.6 Arial,sans-serif;color:#c8d9cf;">${name} wants to start a conversation about Canopryx.</p>
          </div>
          <div style="padding:28px 24px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;table-layout:fixed;margin:0 -8px;width:calc(100% + 16px);">
              <tr>${detail('Name', name)}${detail('Work email', `<a href="mailto:${email}" style="color:#2a6f7e;text-decoration:none;">${email}</a>`)}</tr>
              <tr>${detail('Role / title', role)}${detail('Industry', industry)}</tr>
              <tr>${detail('Company size', companySize)}${detail('Current setup', secretsSetup)}</tr>
            </table>
            <div style="margin-top:4px;padding:22px;background:#eef6f2;border-left:4px solid #2a6f7e;border-radius:4px 16px 16px 4px;">
              <div style="margin-bottom:10px;font:700 10px/1.2 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#587065;">What they are trying to protect</div>
              <div style="font:500 15px/1.75 Arial,sans-serif;color:#14261c;white-space:pre-wrap;">${protectionGoals}</div>
            </div>
            ${message ? `<div style="margin-top:16px;padding:20px 22px;border:1px solid #e1e8e4;border-radius:16px;"><div style="margin-bottom:10px;font:700 10px/1.2 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#587065;">Additional context</div><div style="font:400 15px/1.75 Arial,sans-serif;color:#33483d;white-space:pre-wrap;">${message}</div></div>` : ''}
            <p style="margin:22px 2px 0;font:400 12px/1.6 Arial,sans-serif;color:#6a7d72;">Reply to this email to contact the applicant directly.</p>
          </div>
        </div>
      </div>
    </div>
  </body></html>`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined) || import.meta.env.RESEND_API_KEY;
  const contactRecipient =
    (typeof process !== 'undefined' ? process.env.CONTACT_TO_EMAIL : undefined) ||
    import.meta.env.CONTACT_TO_EMAIL ||
    defaultContactRecipient;
  const contactSender =
    (typeof process !== 'undefined' ? process.env.CONTACT_FROM_EMAIL : undefined) ||
    import.meta.env.CONTACT_FROM_EMAIL ||
    'Canopryx Contact Form <onboarding@resend.dev>';

  if (!apiKey) {
    console.error('Contact email service is not configured.');
    return jsonResponse({ error: 'Email service is temporarily unavailable.' }, 503);
  }

  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 12_000) {
      return jsonResponse({ error: 'Request is too large.' }, 413);
    }

    const rawData: unknown = await request.json();

    if (
      typeof rawData === 'object' &&
      rawData !== null &&
      'website' in rawData &&
      typeof rawData.website === 'string' &&
      rawData.website.length > 0
    ) {
      return jsonResponse({ success: true }, 200);
    }

    const isEarlyAccess = typeof rawData === 'object' && rawData !== null && 'formType' in rawData && rawData.formType === 'early-access';
    const parsed = isEarlyAccess ? earlyAccessSchema.safeParse(rawData) : contactSchema.safeParse(rawData);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => i.message).join(", ");
      return jsonResponse({ error: errorMsg }, 400);
    }

    const resend = new Resend(apiKey);
    const emailOptions = 'formType' in parsed.data
      ? {
          from: contactSender,
          to: [contactRecipient],
          replyTo: parsed.data.email,
          subject: `Early Access Request: ${parsed.data.organization}`,
          html: renderEarlyAccessEmail({
            name: escapeHtml(parsed.data.name),
            email: escapeHtml(parsed.data.email),
            organization: escapeHtml(parsed.data.organization),
            role: escapeHtml(parsed.data.role),
            industry: escapeHtml(parsed.data.industry),
            companySize: escapeHtml(parsed.data.companySize),
            secretsSetup: escapeHtml(parsed.data.secretsSetup),
            protectionGoals: escapeHtml(parsed.data.protectionGoals),
            message: parsed.data.message ? escapeHtml(parsed.data.message) : '',
          }),
        }
      : {
          from: contactSender,
          to: [contactRecipient],
          replyTo: parsed.data.email,
          subject: `New Contact Request: ${parsed.data.subject || 'No Subject'}`,
          html: renderContactEmail({
            name: escapeHtml(parsed.data.name),
            email: escapeHtml(parsed.data.email),
            subject: parsed.data.subject ? escapeHtml(parsed.data.subject) : 'N/A',
            message: escapeHtml(parsed.data.message),
          }),
        };
    const { data: resendData, error } = await resend.emails.send(emailOptions);

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
