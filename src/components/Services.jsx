import {
  Cpu,
  Settings,
  LineChart,
  Sparkles,
} from "lucide-react"
import ServiceCard from "./ServiceCard"

const services = [
  {
    title: "AI & Automation",
    description: "Streamline your business with intelligent decision-making and automated workflows.",
    icon: Cpu,
  },
  {
    title: "Product Engineering",
    description: "We take your ideas from concept to deployment with agile and scalable systems.",
    icon: Settings,
  },
  {
    title: "Data & Insights",
    description: "Make smarter moves with machine learning models that keep humans at the core.",
    icon: LineChart,
  },
  {
    title: "Tech Consulting",
    description: "From startups to scale-ups, we offer guidance, strategy, and system audits.",
    icon: Sparkles,
  },
]

export default function Services() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        What We Do
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <ServiceCard
            key={i}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </section>
  )
}
