import React from 'react';
import ProjectCard from '../components/ProjectCard';

// Replace with your actual project data
const projects = [
  {
    name: 'Project One',
    description: 'A brief description of the project.',
    imageUrl: 'https://via.placeholder.com/400x200',
    link: '#',
  },
  {
    name: 'Project Two',
    description: 'A brief description of the project.',
    imageUrl: 'https://via.placeholder.com/400x200',
    link: '#',
  },
  // Add more projects as needed
];

const ProjectsPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">
        Our <span className="text-ocubyte-accent">Projects</span>
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
