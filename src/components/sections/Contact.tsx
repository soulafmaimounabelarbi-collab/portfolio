import { useState } from 'react';
import { Send, CheckCircle, Mail } from 'lucide-react';
import { SectionWrapper, SectionHeading } from '../layout/SectionWrapper';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { addMessage } from '../../hooks/usePortfolioStore';

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateForm(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email.';
  }
  if (!fields.subject.trim()) errors.subject = 'Subject is required.';
  if (!fields.message.trim()) errors.message = 'Message is required.';
  else if (fields.message.trim().length < 20) errors.message = 'Message must be at least 20 characters.';
  return errors;
}

export function Contact() {
  const [fields, setFields] = useState<FormFields>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validateForm(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSending(true);
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 800));
    // Save message to localStorage so the dashboard can display it
    addMessage({
      name: fields.name.trim(),
      email: fields.email.trim(),
      subject: fields.subject.trim(),
      message: fields.message.trim(),
    });
    setSending(false);
    setSent(true);
  };

  return (
    <SectionWrapper id="contact" className="bg-blush" label="Contact">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's work together."
            description="Open to full-time roles, freelance projects, and interesting collaborations. Reach out and I'll reply within 24 hours."
          />

          <div className="flex items-center gap-3 mt-2">
            <Mail className="w-4 h-4 text-rose shrink-0" aria-hidden="true" />
            <a
              href="mailto:contact@belarbisoulef.com"
              className="text-sm text-charcoal hover:text-roseDeep transition-colors focus:outline-none focus:ring-2 focus:ring-rose rounded-sm"
            >
              contact@belarbisoulef.com
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-cream rounded-2xl p-8 border border-petal">
          {sent ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <CheckCircle className="w-12 h-12 text-rose" aria-hidden="true" />
              <h3 className="font-display text-2xl text-charcoal">Message sent!</h3>
              <p className="text-slate text-sm">
                Thanks for reaching out. I'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setFields({ name: '', email: '', subject: '', message: '' }); }}
                className="text-xs text-rose hover:text-roseDeep transition-colors focus:outline-none focus:ring-2 focus:ring-rose rounded-md mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <Input
                  id="name"
                  label="Name"
                  placeholder="Your name"
                  value={fields.name}
                  onChange={update('name')}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={update('email')}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>
              <Input
                id="subject"
                label="Subject"
                placeholder="What's this about?"
                value={fields.subject}
                onChange={update('subject')}
                error={errors.subject}
              />
              <Textarea
                id="message"
                label="Message"
                placeholder="Tell me about your project or opportunity..."
                rows={5}
                value={fields.message}
                onChange={update('message')}
                error={errors.message}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={sending}
                className="w-full justify-center"
                aria-label="Send message"
              >
                {sending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    Send message
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
