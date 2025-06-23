// src/pages/ProjectsPage.jsx
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Maison Jorgie",
    description: "Luxury fashion e-commerce app built with React Native.",
    tags: ["App", "E-commerce"],
    image: "/images/jorgie.png",
  },
  {
    title: "George Wood Casket",
    description: "Legacy-driven funeral home website redesign.",
    tags: ["Branding", "Website"],
    image: "/images/gwc.png",
  },
  // ...more
];

export default function ProjectsPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Our Work</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj, i) => (
          <ProjectCard key={i} {...proj} />
        ))}
      </div>
    </section>
  );
}
