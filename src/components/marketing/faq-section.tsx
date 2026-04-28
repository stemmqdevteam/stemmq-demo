"use client";

import { Accordion } from "@/components/ui/accordion";

const faqs = [
  { title: "What is Decision Intelligence?", content: "Decision Intelligence is a discipline that combines data science, social science, and managerial science to systematically improve organizational decision-making. StemmQ provides the infrastructure to capture, track, and optimize strategic decisions across your organization." },
  { title: "How is StemmQ different from project management tools?", content: "Project management tools track tasks and deliverables. StemmQ tracks the decisions behind those tasks — the strategic reasoning, assumptions, projected outcomes, and quality scores. It operates at the strategic layer above execution." },
  { title: "What are Structured Decision Objects (SDOs)?", content: "SDOs are StemmQ's core data model. Every strategic decision is captured with its context, assumptions, ownership, quality score, and projected outcomes. This creates an auditable, searchable decision history that preserves institutional knowledge." },
  { title: "How do AI agents work in StemmQ?", content: "You create agents using a no-code builder — define their role, objective, decision scope, and risk boundaries. Every agent action generates a structured decision object that flows through StemmQ's Decision Gate. Human review is conditional: it only activates when risk, financial exposure, or confidence thresholds are crossed. Agents reference organizational memory and past decisions to justify every proposal." },
  { title: "Is my data secure?", content: "Yes. StemmQ is SOC 2 Type II certified, GDPR compliant, and encrypts all data with AES-256 at rest and TLS 1.3 in transit. We offer data sovereignty options and enterprise SSO/SAML integration." },
  { title: "Can I integrate StemmQ with my existing tools?", content: "StemmQ integrates with Salesforce, Slack, Jira, and more. Our API allows custom integrations with any system. We're continuously adding new integrations based on customer demand." },
  { title: "How long does it take to get started?", content: "Most teams are up and running within 30 minutes. Our onboarding wizard guides you through workspace setup, and you can start capturing decisions immediately. Enterprise deployments with SSO and custom configurations typically take 1-2 weeks." },
  { title: "What happens to my data if I cancel?", content: "Your data remains accessible for 90 days after cancellation. You can export all decisions, assumptions, and reports in standard formats at any time. We never lock you into our platform." },
];

export function FAQSection() {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">Frequently asked questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you need to know about StemmQ.</p>
        </div>
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
