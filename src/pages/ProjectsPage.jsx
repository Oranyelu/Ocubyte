import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { projectsData } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';

const ProjectsPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSocials = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(p => 
        Array.isArray(p.category) 
          ? p.category.includes(filter) 
          : p.category === filter
      );

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Client <span className="text-accent">Projects</span>
        </h1>
        <p className="text-muted text-lg">
          Explore real partnerships where we redesigned brand systems, built custom applications, and automated operations.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {['all', 'branding', 'development', 'automation', 'social'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === cat
                ? 'bg-accent text-white border-accent shadow-lg shadow-accent/15'
                : 'bg-slate-200/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 text-text/80 hover:border-accent/40'
            }`}
          >
            {cat === 'all' ? 'All Work' : cat === 'social' ? 'Social Media' : cat === 'development' ? 'Websites & Apps' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid md:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onOpenSocials={handleOpenSocials} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Project Modal for socials */}
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />

      {/* Global Partnership Prompter */}
      <section className="premium-card p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 mt-12">
        <h2 className="text-3xl font-extrabold">Have a complex custom project in mind?</h2>
        <p className="text-muted text-sm max-w-xl mx-auto">
          We do not believe in one-size-fits-all. We write custom integrations and design tailormade visual assets that fit your exact business specifications.
        </p>
        <Link to="/contact" className="inline-block">
          <Button className="font-bold px-8 py-3.5 flex items-center gap-2 mx-auto">
            Schedule a Discovery Call <ExternalLink size={15} />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default ProjectsPage;

