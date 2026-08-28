import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Compass, 
  Heart, 
  Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { AboutIllustration } from '../components/TechIllustration';

const AboutPage = () => {
  const values = [
    {
      icon: <Terminal className="h-6 w-6 text-accent" />,
      title: 'Creative Engineering',
      desc: 'We do not rely on templates or bulky page builders. We write clean, custom software tailored specifically for your operational goals.'
    },
    {
      icon: <Cpu className="h-6 w-6 text-accent" />,
      title: 'Relentless Automation',
      desc: 'If a task has to be performed twice, it should be automated. We eliminate manual errors so your team can focus on growth.'
    },
    {
      icon: <Compass className="h-6 w-6 text-accent" />,
      title: 'Cohesive Branding',
      desc: 'Design is not just how it looks; it is how it works. We establish clean visual identities that build trust with customers.'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl space-y-16">
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          About <span className="text-accent">Ocubyte</span>
        </h1>
        <p className="text-muted text-lg">
          We are a custom product studio helping small to medium businesses redesign, build, and automate from the ground up.
        </p>
      </div>

      {/* Intro */}
      <div className="grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold">Who We Are</h2>
          <p className="text-muted text-sm leading-relaxed">
            Ocubyte was founded on a simple principle: **eliminate complexity**. Many businesses struggle to grow because their digital presence looks outdated, or their employees are bogged down by hours of manual database logging.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            We operate as your technical and creative partners. By pairing custom high-fidelity software development with robust branding systems and automated task management, we help businesses modernise their operations seamlessly.
          </p>
        </div>

        <div className="md:col-span-5 flex justify-center items-center">
          <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
            <AboutIllustration />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <section className="space-y-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">Our Core Pillars</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full space-y-4 p-6 hover:-translate-y-1 transition-all">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 flex-shrink-0 w-max">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{v.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="premium-card p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold">Ready to upgrade your system?</h2>
        <p className="text-muted text-sm max-w-md mx-auto">
          Let’s discuss your logo rebranding needs, software feature lists, and automated workflow triggers.
        </p>
        <Link to="/contact" className="inline-block">
          <Button className="font-bold px-8 py-3.5 flex items-center gap-2 mx-auto">
            Partner with Us <Sparkles size={16} />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
