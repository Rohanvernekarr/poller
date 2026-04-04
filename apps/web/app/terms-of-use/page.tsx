import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Poller",
  description:
    "Read Poller's Terms of Service to understand the rules, rights, and responsibilities when using our polling platform.",
};

const LAST_UPDATED = "April 4, 2026";
const EFFECTIVE_DATE = "April 4, 2026";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement to Terms",
        body: 'By accessing or using Poller ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.',
      },
      {
        subtitle: "Changes to Terms",
        body: "We reserve the right to modify these Terms at any time. When we make material changes, we will provide at least 30 days' notice by email or by posting a notice on the Service. Your continued use of the Service after the effective date of revised Terms constitutes your acceptance of the changes.",
      },
    ],
  },
  {
    id: "description",
    title: "Description of Service",
    content: [
      {
        subtitle: "What Poller Provides",
        body: "Poller is an online polling and surveying platform that allows users to create polls, collect votes, and view real-time results. The Service is provided on an 'as-is' and 'as-available' basis. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.",
      },
      {
        subtitle: "Service Availability",
        body: "We strive to maintain high availability but do not guarantee uninterrupted access. Scheduled maintenance, unexpected outages, and factors outside our control may cause the Service to be temporarily unavailable. We will endeavour to provide advance notice of planned maintenance.",
      },
    ],
  },
  {
    id: "accounts",
    title: "User Accounts",
    content: [
      {
        subtitle: "Account Registration",
        body: "To access certain features of the Service, you must create an account. You agree to provide accurate, complete, and current information during registration and to keep this information up to date. You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        subtitle: "Account Responsibility",
        body: "You are responsible for all activity that occurs under your account. You agree to immediately notify us of any unauthorized use of your account. We are not liable for any losses arising from unauthorized account access caused by your failure to safeguard your credentials.",
      },
      {
        subtitle: "Account Termination",
        body: "You may delete your account at any time from your account settings. We reserve the right to suspend or terminate your account at our discretion if you violate these Terms, without prior notice.",
      },
    ],
  },
  {
    id: "user-content",
    title: "User Content",
    content: [
      {
        subtitle: "Your Content",
        body: "You retain ownership of any content (including poll questions, options, and responses) that you submit, create, or post through the Service ('User Content'). By posting User Content, you grant Poller a worldwide, non-exclusive, royalty-free license to use, store, display, and distribute your User Content solely to operate and improve the Service.",
      },
      {
        subtitle: "Content Standards",
        body: "You agree that your User Content will not: (a) violate any applicable law or regulation; (b) infringe any intellectual property rights; (c) contain defamatory, obscene, or hateful material; (d) include personal data of others without their consent; (e) impersonate any person or entity; or (f) contain malware, spam, or deceptive content.",
      },
      {
        subtitle: "Content Removal",
        body: "We reserve the right to remove any User Content that violates these Terms or that we determine, in our sole discretion, is harmful, offensive, or otherwise objectionable. We will endeavour to notify you of such removals where legally permissible.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: [
      {
        subtitle: "Permitted Use",
        body: "You may use the Service only for lawful purposes and in accordance with these Terms. You may not use the Service in any way that violates applicable local, national, or international law or regulation.",
      },
      {
        subtitle: "Prohibited Activities",
        body: "You agree not to: (a) attempt to gain unauthorized access to any part of the Service or its related systems; (b) use automated tools to scrape, mine, or extract data from the Service without our express written consent; (c) reverse engineer, decompile, or disassemble the Service; (d) use the Service to send unsolicited communications; (e) interfere with or disrupt the integrity or performance of the Service; or (f) engage in vote manipulation, including submitting fraudulent responses.",
      },
      {
        subtitle: "Rate Limits",
        body: "We may impose rate limits or usage quotas to ensure fair access for all users. Circumventing such limits is prohibited and may result in account termination.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Our IP",
        body: "The Service and its original content, features, and functionality — including but not limited to the Poller name, logo, software, design, and documentation — are owned by Poller and are protected by copyright, trademark, and other intellectual property laws. No rights are granted to you except as expressly stated in these Terms.",
      },
      {
        subtitle: "Feedback",
        body: "If you provide us with any feedback, suggestions, or ideas regarding the Service, you grant us an unrestricted, irrevocable, perpetual, worldwide license to use such feedback for any purpose without compensation to you.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    content: [
      {
        subtitle: "Privacy Policy",
        body: "Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our collection and use of your data as described in the Privacy Policy.",
      },
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content: [
      {
        subtitle: "Third-Party Links",
        body: "The Service may contain links to third-party websites or services that are not owned or controlled by Poller. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We strongly advise you to review the privacy policy of every site you visit.",
      },
      {
        subtitle: "OAuth Providers",
        body: "You may sign in to the Service using third-party OAuth providers such as Google. Your use of such providers is subject to their respective terms of service and privacy policies.",
      },
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Limitations",
    content: [
      {
        subtitle: "Disclaimer of Warranties",
        body: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND COURSE OF DEALING. POLLER DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.',
      },
      {
        subtitle: "Limitation of Liability",
        body: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL POLLER, ITS AFFILIATES, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE.",
      },
      {
        subtitle: "Indemnification",
        body: "You agree to defend, indemnify, and hold harmless Poller and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to your use of the Service, your User Content, or your violation of these Terms.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    content: [
      {
        subtitle: "Governing Law",
        body: "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Poller is incorporated, without regard to its conflict of law provisions.",
      },
      {
        subtitle: "Dispute Resolution",
        body: "Before filing a claim, you agree to first attempt to resolve any dispute informally by contacting us at legal@poller.app. If the dispute is not resolved within 30 days, either party may bring a formal claim in a court of competent jurisdiction.",
      },
      {
        subtitle: "Class Action Waiver",
        body: "To the extent permitted by law, you agree that you will bring any dispute against Poller in your individual capacity, not as a plaintiff or class member in any purported class or representative action.",
      },
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: [
      {
        subtitle: "Termination by You",
        body: "You may stop using the Service at any time and may delete your account through your account settings. Termination of your account does not relieve you of any obligations that arose before termination.",
      },
      {
        subtitle: "Termination by Us",
        body: "We may suspend or terminate your access to the Service, with or without cause, at any time with reasonable notice. Upon termination, your right to use the Service will immediately cease. Sections that by their nature should survive termination will survive (including limitations on liability, indemnification, and dispute resolution).",
      },
    ],
  },
  {
    id: "general",
    title: "General Provisions",
    content: [
      {
        subtitle: "Entire Agreement",
        body: "These Terms, together with the Privacy Policy and any other legal notices published by Poller, constitute the entire agreement between you and Poller relating to the Service and supersede all prior agreements.",
      },
      {
        subtitle: "Severability",
        body: "If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity of the remaining provisions.",
      },
      {
        subtitle: "Waiver",
        body: "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. Any waiver of any provision will be effective only if made in writing and signed by an authorised representative of Poller.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    content: [
      {
        subtitle: "Legal Inquiries",
        body: "For questions about these Terms, please contact us at legal@poller.app. For support inquiries, please visit our Help Center or contact support@poller.app.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-foreground/[0.02]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-foreground flex items-center justify-center">
              <FileText className="w-5 h-5 text-background" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic">
              Legal
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight italic mb-6">
            Terms of Service
          </h1>
          <p className="text-foreground/50 font-medium leading-relaxed max-w-2xl text-lg">
            Please read these Terms carefully before using Poller. By using the
            platform, you agree to be bound by these Terms.
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
          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              {
                label: "Data",
                value: "Never Sold",
                desc: "Your data is yours. We never sell it.",
              },
              {
                label: "Content",
                value: "You Own It",
                desc: "Your polls and votes belong to you.",
              },
              {
                label: "Notice",
                value: "30 Days",
                desc: "We give 30 days notice before material changes.",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="border border-border rounded-2xl p-5 bg-foreground/[0.02]"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic mb-1">
                  {card.label}
                </p>
                <p className="text-lg font-black uppercase tracking-tight italic mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-foreground/50 font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

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
              Questions about these Terms?
            </p>
            <p className="font-bold text-sm text-foreground/60 leading-relaxed mb-4">
              Our legal team is happy to answer any questions you have about
              these Terms or your rights as a user.
            </p>
            <a
              href="mailto:legal@poller.app"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-tight italic hover:text-foreground/60 transition-colors"
            >
              legal@poller.app
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <Link
              href="/privacy"
              className="text-xs font-black uppercase tracking-widest italic text-foreground/40 hover:text-foreground transition-colors"
            >
              Privacy Policy →
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
