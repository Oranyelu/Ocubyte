import Hero from "../components/Hero"
import Services from "../components/Services"
import Features from "../components/Features"
import CTA from "../components/CTA"
import GlassPanel from "../components/GlassPanel"

export default function Home() {
  return (
    <div className="space-y-20">
      <Hero />

      {/* Optional: Only show this on Glass theme */}
      <GlassPanel title="We Byte Hard" subtitle="Code that feels. Powered by AI. Built for humans.">
        <p className="text-sm text-white/70">Context-aware systems. Seamless automation. Built with empathy.</p>
      </GlassPanel>

      <Services />
      <Features />
      <CTA />
    </div>
  )
}
