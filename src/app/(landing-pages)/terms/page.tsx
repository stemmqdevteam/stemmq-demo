import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", content: "By accessing or using the StemmQ platform (\"Service\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree, do not use the Service. These Terms apply to all users, including organizations and their authorized representatives." },
  { id: "description", title: "Description of Service", content: "StemmQ provides a Strategic Decision Intelligence Platform that enables organizations to capture, structure, and analyze strategic decisions. The platform includes decision capture, assumption tracking, simulation modeling, AI agent governance, document intelligence, and analytics capabilities." },
  { id: "accounts", title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration. You must notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these Terms." },
  { id: "acceptable-use", title: "Acceptable Use", content: "You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to transmit malicious code, attempt to gain unauthorized access to our systems, interfere with other users' use of the Service, or violate any applicable laws or regulations." },
  { id: "intellectual-property", title: "Intellectual Property", content: "The Service and its original content, features, and functionality are owned by StemmQ and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Your data remains your property; we claim no ownership over your decision data, documents, or other content." },
  { id: "data-rights", title: "Data Rights and Processing", content: "You retain all rights to your data. By using the Service, you grant us a limited license to process your data solely for the purpose of providing and improving the Service. We will not sell your data to third parties. See our Privacy Policy for full details on data handling." },
  { id: "subscription", title: "Subscription and Billing", content: "Paid features are available through subscription plans. Billing occurs on a monthly or annual basis as selected. You may cancel at any time; cancellation takes effect at the end of your current billing period. Refunds are provided in accordance with our refund policy." },
  { id: "limitation", title: "Limitation of Liability", content: "To the maximum extent permitted by law, StemmQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability for any claim arising out of these Terms shall not exceed the amount you paid us in the twelve months preceding the claim." },
  { id: "termination", title: "Termination", content: "We may terminate or suspend your access immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service ceases immediately. You may export your data prior to termination or within 30 days after termination." },
  { id: "governing-law", title: "Governing Law", content: "These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions." },
  { id: "changes", title: "Changes to Terms", content: "We reserve the right to modify these Terms at any time. We will provide notice of material changes at least 30 days before they take effect. Continued use of the Service after changes constitute acceptance of the modified Terms." },
  { id: "contact", title: "Contact", content: "For questions about these Terms, please contact us at legal@stemmq.com." },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
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
