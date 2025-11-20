import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';

const ContactPage = () => {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-lg"
      >
        <h1 className="mb-8 text-center text-4xl font-bold md:text-6xl">
          Get in <span className="text-ocubyte-accent">Touch</span>
        </h1>
        <GlassCard>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-medium">Name</label>
              <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2 text-white" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium">Email</label>
              <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2 text-white" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-lg font-medium">Message</label>
              <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 p-2 text-white"></textarea>
            </div>
            <div className="text-center">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ContactPage;
