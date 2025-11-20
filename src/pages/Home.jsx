import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { motion } from 'framer-motion'; // Assuming framer-motion is installed

const Home = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold md:text-8xl">
          <span className="animate-neon-flicker text-ocubyte-accent">Ocu</span>byte
        </h1>
        <p className="mt-4 text-xl md:text-2xl">Creative Product Studio</p>
        <Link to="/about" className="mt-8 inline-block">
          <Button>Learn More</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
