// src/components/ProjectCard.jsx
export default function ProjectCard({ title, description, tags, image }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md backdrop-blur bg-white/10 border border-white/20 transition hover:scale-[1.02] hover:shadow-xl">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-ocubyte-accent/10 text-ocubyte-accent px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
