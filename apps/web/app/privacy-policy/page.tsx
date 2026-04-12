import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Poller",
  description:
    "Learn how Poller collects, uses, stores, and protects your personal information when you use our polling platform.",
};

const LAST_UPDATED = "April 4, 2026";
const EFFECTIVE_DATE = "April 4, 2026";

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Information You Provide",
        body: "When you create an account, we collect your name and email address. When you create or respond to polls, we collect the content you submit. If you contact us for support, we collect the content of your messages.",
      },
      {
        subtitle: "Information Collected Automatically",
        body: "We automatically collect certain technical information when you use Poller, including your IP address, browser type and version, operating system, referring URLs, pages viewed, and the date and time of your visit. We use cookies and similar tracking technologies to maintain your session and remember your preferences.",
      },
      {
        subtitle: "Authentication Data",
        body: "When you sign in using OAuth providers (such as Google), we receive a limited set of profile information from that provider - typically your name, email address, and profile photo - in accordance with their privacy policies and your permissions.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "To Provide the Service",
        body: "We use your information to operate and deliver the core features of Poller - creating polls, recording votes, displaying results, and managing your account and dashboard.",
      },
      {
        subtitle: "To Improve the Service",
        body: "We analyze usage patterns and aggregate data to understand how people use Poller, identify issues, and improve features. This analysis is done using anonymized or aggregated data where possible.",
      },
      {
        subtitle: "To Communicate With You",
        body: "We may send you transactional emails (such as account verification or security notices) and, where you have opted in, product updates and announcements. You can opt out of non-essential communications at any time.",
      },
      {
        subtitle: "To Ensure Security",
        body: "We use your information to detect, investigate, and prevent fraudulent activity, abuse, or violations of our Terms of Service.",
      },
    ],
  },
  {
    id: "sharing-your-information",
    title: "Sharing Your Information",
    content: [
      {
        subtitle: "We Do Not Sell Your Data",
        body: "Poller does not sell, rent, or trade your personal information to third parties for their marketing purposes.",
      },
      {
        subtitle: "Service Providers",
        body: "We share information with trusted third-party vendors who help us operate the platform - including cloud infrastructure providers (e.g., hosting and databases), authentication services, and analytics tools. These parties are contractually bound to use your data only as directed by us.",
      },
      {
        subtitle: "Legal Requirements",
        body: "We may disclose your information if required by law, regulation, court order, or governmental authority, or if we believe disclosure is necessary to protect rights, property, or safety.",
      },
      {
        subtitle: "Business Transfers",
        body: "If Poller is involved in a merger, acquisition, or asset sale, your information may be transferred. We will notify you before your personal data is transferred and subject to a different Privacy Policy.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: [
      {
        subtitle: "Account Data",
        body: "We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required by law to retain it longer.",
      },
      {
        subtitle: "Poll Data",
        body: "Polls and votes you have created are retained until you delete them or close your account. Anonymous vote data may be retained in aggregated form for analytics purposes even after deletion.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    content: [
      {
        subtitle: "Access & Portability",
        body: "You have the right to access the personal information we hold about you and to receive it in a portable format. You can export your data at any time from your account dashboard.",
      },
      {
        subtitle: "Correction",
        body: "You may update or correct your account information directly in your profile settings at any time.",
      },
      {
        subtitle: "Deletion",
        body: "You may request deletion of your personal data by deleting your account or contacting us at privacy@poller.app. We will process your request within 30 days.",
      },
      {
        subtitle: "Opt-Out",
        body: "You may opt out of marketing communications by clicking 'Unsubscribe' in any email. You may also disable cookies through your browser settings, though this may impact some functionality.",
      },
      {
        subtitle: "GDPR & CCPA Rights",
        body: "If you are a resident of the European Economic Area or California, you may have additional rights including the right to object to processing, the right to restrict processing, and the right to lodge a complaint with a supervisory authority.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        body: "We use essential cookies to authenticate your session and maintain security. These are strictly necessary for the service to function and cannot be disabled.",
      },
      {
        subtitle: "Analytics Cookies",
        body: "We use analytics cookies to understand how visitors interact with our platform. This data is aggregated and does not identify you personally. You may opt out via our cookie banner or browser settings.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    content: [
      {
        subtitle: "Our Measures",
        body: "We implement industry-standard security measures including encryption in transit (TLS/HTTPS), encryption at rest, access controls, and regular security audits. We use reputable cloud infrastructure providers with SOC 2 and ISO 27001 certifications.",
      },
      {
        subtitle: "Data Breach Notification",
        body: "In the event of a data breach that affects your personal information, we will notify you in accordance with applicable law, typically within 72 hours of becoming aware of the breach.",
      },
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      {
        subtitle: "Age Restriction",
        body: "Poller is not directed at children under the age of 13 (or 16 in certain jurisdictions). We do not knowingly collect personal information from children. If we become aware that we have collected data from a child without appropriate consent, we will delete it promptly.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      {
        subtitle: "Notification of Updates",
        body: "We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email and/or by posting a prominent notice on our platform at least 30 days before the changes take effect. Your continued use of the service after the effective date constitutes acceptance of the updated policy.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      {
        subtitle: "Privacy Inquiries",
        body: "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our Privacy Team at privacy@poller.app. For EU/UK data subjects, our Data Protection Officer can be reached at dpo@poller.app.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-2xl bg-foreground flex items-center justify-center">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <span className="text-[14px] font-black uppercase tracking-widest text-foreground/30 italic">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight italic mb-6">
            Privacy Policy
          </h1>
          <p className="text-foreground/50 font-medium leading-relaxed max-w-2xl text-lg">
            We believe privacy is a fundamental right. This policy explains
            clearly and transparently how Poller handles your data - no legalese.
          </p>
          <div className="flex flex-wrap gap-6 mt-8 text-[11px] font-black uppercase tracking-widest text-foreground/30 italic">
            <span>Effective: {EFFECTIVE_DATE}</span>
            <span className="text-foreground/10">·</span>
            <span>Last Updated: {LAST_UPDATED}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">
        {/* Sidebar TOC */}
        <aside className="lg:w-56 shrink-0">
          <div className="lg:sticky lg:top-20">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic mb-4">
              Contents
            </p>
            <nav className="space-y-1">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight text-foreground/40 hover:text-foreground transition-colors py-1 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>
                    {i + 1}. {s.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-16">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight italic">
                  {section.title}
                </h2>
              </div>
              <div className="border-l-2 border-border pl-9 space-y-6">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="font-black uppercase tracking-tight text-sm mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed text-sm font-medium">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom CTA */}
          <div className="border border-border rounded-2xl p-8 bg-foreground/[0.03] mt-12">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic mb-3">
              Questions?
            </p>
            <p className="font-bold text-sm text-foreground/60 leading-relaxed mb-4">
              We are committed to being transparent about how we handle your
              data. If anything in this policy is unclear, reach out - we will
              respond promptly.
            </p>
            <a
              href="mailto:privacy@poller.app"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tight italic hover:text-foreground/60 transition-colors"
            >
              privacy@poller.app
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <Link
              href="/terms-of-use"
              className="text-xs font-black uppercase tracking-widest italic text-foreground/40 hover:text-foreground transition-colors"
            >
              Terms of Service →
            </Link>
            <Link
              href="/"
              className="text-xs font-black uppercase tracking-widest italic text-foreground/40 hover:text-foreground transition-colors"
            >
              Back to Home →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
