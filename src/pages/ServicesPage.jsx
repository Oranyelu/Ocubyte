import ServiceCard from "../components/ServiceCard"
import { Paintbrush, Code, Sparkles, Database } from "lucide-react"

const services = [
  {
    title: "Product Design & Branding",
    description: "We help startups stand out with unforgettable visuals and powerful brand messaging.",
    icon: Paintbrush,
  },
  {
    title: "Web & Mobile Development",
    description: "Full-stack magic — built for performance, elegance, and scale.",
    icon: Code,
  },
  {
    title: "Content Automation",
    description: "We automate your online presence so you can focus on being iconic.",
    icon: Sparkles,
  },
  {
    title: "Enterprise Systems",
    description: "Custom tools and databases to power your operations behind the scenes.",
    icon: Database,
  },
]

export default function ServicesPage () {
  return (
    <section className="px-6 py-20 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">What We Do</h1>
      <p className="text-white/60 max-w-xl mx-auto mb-10">
        Ocubyte is your digital pit crew — we design, build, and automate your business from the ground up.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <ServiceCard key={i} {...s} />
        ))}
      </div>
    </section>
  )
}
