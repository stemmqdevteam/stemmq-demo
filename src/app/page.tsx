import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { InteractiveFeatures } from "@/components/marketing/interactive-features";
import { StrategyVisualization } from "@/components/marketing/strategy-visualization";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { AIAgentsSection } from "@/components/marketing/ai-agents-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { EnterpriseSection } from "@/components/marketing/enterprise-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { RoadmapSection } from "@/components/marketing/roadmap-section";
import { FAQSection } from "@/components/marketing/faq-section";
import { CTASection } from "@/components/marketing/cta-section";
import { FadeIn } from "@/components/animations/fade-in";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <HeroSection />

      <ProductShowcase />

      {/* Problem / Solution */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <FadeIn direction="left">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-danger">The Problem</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                  Strategic decisions are made in the dark
                </h2>
                <ul className="mt-6 space-y-4">
                  {[
                    "Critical decisions buried in Slack threads, docs, and email",
                    "Assumptions never tracked, validated, or challenged",
                    "No pattern recognition across decision history",
                    "Organizational knowledge lost with every leadership transition",
                    "AI agents making decisions without governance or audit trails",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-success">The Solution</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                  StemmQ makes decision-making a system
                </h2>
                <ul className="mt-6 space-y-4">
                  {[
                    "Every decision captured as a Structured Decision Object",
                    "Assumptions explicitly tracked with validity scoring",
                    "Pattern recognition surfaces behavioral biases and trends",
                    "Institutional continuity preserves context across transitions",
                    "Agent governance with approval gates and audit trails",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <InteractiveFeatures />
      <StrategyVisualization />
      <WorkflowSection />
      <AIAgentsSection />
      <FeatureGrid />
      <EnterpriseSection />
      {/* <TrustSection /> */}
      <PricingCards />
      <RoadmapSection />
      <FAQSection />
      <CTASection />

      <MarketingFooter />
    </div>
  );
}
