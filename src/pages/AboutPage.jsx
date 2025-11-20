import React from 'react';
import GlassCard from '../components/GlassCard';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4">
      <GlassCard>
        <h1 className="text-4xl font-bold mb-4">About Ocubyte</h1>
        <p className="text-lg">
          Ocubyte is a forward-thinking technology company dedicated to creating innovative solutions for the modern world. We specialize in building beautiful, functional, and user-friendly applications that push the boundaries of what's possible.
        </p>
        <p className="text-lg mt-4">
          Our team of expert developers and designers is passionate about crafting exceptional user experiences. We believe in the power of technology to transform businesses and lives, and we're committed to helping our clients achieve their goals.
        </p>
      </GlassCard>
    </div>
  );
};

export default AboutPage;
