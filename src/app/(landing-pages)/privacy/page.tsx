import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  { id: "introduction", title: "Introduction", content: "StemmQ (\"we\", \"our\", \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Strategic Decision Intelligence Platform." },
  { id: "information-we-collect", title: "Information We Collect", content: "We collect information you provide directly, including account registration data (name, email, company), decision data and assumptions entered into the platform, documents uploaded for analysis, and usage data about how you interact with our services." },
  { id: "how-we-use", title: "How We Use Your Information", content: "We use your information to provide and maintain our platform, improve and personalize your experience, analyze usage patterns and platform performance, communicate with you about updates and changes, and comply with legal obligations." },
  { id: "data-security", title: "Data Security", content: "We implement appropriate technical and organizational measures to protect your data, including encryption at rest and in transit, regular security audits and penetration testing, access controls and authentication mechanisms, and SOC2 compliance framework." },
  { id: "data-retention", title: "Data Retention", content: "We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time. Decision data and audit trails may be retained for compliance purposes as required by applicable law." },
  { id: "third-party-services", title: "Third-Party Services", content: "We may share data with trusted third-party service providers who assist in operating our platform. These providers are contractually obligated to protect your data and use it only for the purposes we specify." },
  { id: "your-rights", title: "Your Rights", content: "Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data, object to or restrict processing, data portability, and withdraw consent where processing is based on consent." },
  { id: "cookies", title: "Cookies and Tracking", content: "We use essential cookies for platform functionality, authentication, and security. We also use analytics cookies to understand how our platform is used. You can manage your cookie preferences through your browser settings." },
  { id: "changes", title: "Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website and, where appropriate, by email notification." },
  { id: "contact", title: "Contact Us", content: "If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@stemmq.com." },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 1, 2026</p>

        <div className="flex gap-12">
          {/* TOC sidebar */}
          <nav className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 max-w-3xl space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="text-lg font-semibold text-foreground mb-3">{s.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}
