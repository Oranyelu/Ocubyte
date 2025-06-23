// src/components/CTA.jsx
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="text-center py-20 px-6 bg-ocubyte-accent/10 border-t border-white/10 backdrop-blur rounded-xl max-w-5xl mx-auto mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ocubyte-accent">
        Let’s build something legendary.
      </h2>
      <p className="text-white/80 mb-6 max-w-xl mx-auto">
        Whether you're launching a new product or revamping an old one, Ocubyte has the tools, talent, and tenacity to bring it to life.
      </p>
      <Link
        to="/contact"
        className="inline-block px-6 py-3 bg-ocubyte-accent text-white font-semibold rounded-lg hover:scale-105 transition"
      >
        Start a Project
      </Link>
    </section>
  );
}
