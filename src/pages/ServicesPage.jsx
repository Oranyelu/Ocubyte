import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FaCode, FaPaintBrush, FaRocket } from 'react-icons/fa';

const services = [
  {
    icon: <FaCode className="h-12 w-12 text-ocubyte-accent" />,
    title: 'Smart Systems',
    description: 'We build robust and scalable systems tailored to your business needs.',
  },
  {
    icon: <FaPaintBrush className="h-12 w-12 text-ocubyte-accent" />,
    title: 'Bold Identities',
    description: 'We create unique and memorable brand identities that stand out.',
  },
  {
    icon: <FaRocket className="h-12 w-12 text-ocubyte-accent" />,
    title: 'Seamless Experiences',
    description: 'We design intuitive and engaging digital experiences for your users.',
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">
        What We <span className="text-ocubyte-accent">Do</span>
      </h1>
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <GlassCard className="text-center">
              <div className="mb-4 inline-block">{service.icon}</div>
              <h2 className="text-2xl font-bold">{service.title}</h2>
              <p className="mt-2">{service.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
