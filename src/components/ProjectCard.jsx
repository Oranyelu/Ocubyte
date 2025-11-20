import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Button from './Button';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="overflow-hidden">
        <img src={project.imageUrl} alt={project.name} className="h-48 w-full object-cover" />
        <div className="p-6">
          <h3 className="text-2xl font-bold">{project.name}</h3>
          <p className="mt-2 text-gray-400">{project.description}</p>
          <div className="mt-4">
            <Button onClick={() => window.open(project.link, '_blank')}>View Project</Button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default ProjectCard;
