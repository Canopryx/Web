import { describe, expect, test } from 'bun:test';
import {
  checkRateLimit,
  contactSchema,
  earlyAccessSchema,
  escapeHtml,
} from '../src/pages/api/send-email';

describe('contact form validation', () => {
  test('accepts a valid contact request', () => {
    const result = contactSchema.safeParse({
      name: 'Ada Lovelace',
      email: 'ada@analytical.engine',
      subject: 'Security review',
      message: 'Please contact me about an on-premises deployment.',
      website: '',
    });

    expect(result.success).toBe(true);
  });

  test('rejects dummy and malformed addresses', () => {
    expect(contactSchema.safeParse({ name: 'Test', email: 'test@example.com', message: 'Hello' }).success).toBe(false);
    expect(contactSchema.safeParse({ name: 'Test', email: 'not-an-email', message: 'Hello' }).success).toBe(false);
  });

  test('requires an organization email for early access', () => {
    const result = earlyAccessSchema.safeParse({
      formType: 'early-access',
      name: 'Ada Lovelace',
      email: 'ada@gmail.com',
      organization: 'Analytical Engines Ltd',
      role: 'CTO',
      industry: 'Enterprise technology',
      companySize: '11-50',
      secretsSetup: 'Self-hosted solution',
      protectionGoals: 'Keep credentials on premises.',
      website: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('email rendering safety', () => {
  test('escapes HTML-significant characters', () => {
    expect(escapeHtml(`<script>alert("x")</script>'&`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&#039;&amp;',
    );
  });
});

describe('contact endpoint rate limiting', () => {
  test('allows five requests per window and rejects the sixth', () => {
    const key = `test-${crypto.randomUUID()}`;
    const now = 1_000;

    for (let request = 0; request < 5; request += 1) {
      expect(checkRateLimit(key, now).allowed).toBe(true);
    }

    expect(checkRateLimit(key, now).allowed).toBe(false);
    expect(checkRateLimit(key, now + (10 * 60 * 1000)).allowed).toBe(true);
  });
});
