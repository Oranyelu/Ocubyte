import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Globe, 
  Cpu, 
  Share2, 
  Check, 
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';

const ServicesPage = () => {
  const [calcHours, setCalcHours] = useState(15);
  const [calcEmployeeCost, setCalcEmployeeCost] = useState(35);
  const [calcTraffic, setCalcTraffic] = useState(5000);

  // ROI calculations
  const monthlySavings = Math.round(calcHours * 4.33 * calcEmployeeCost);
  const yearlySavings = Math.round(monthlySavings * 12);
  // Estimate traffic conversion value
  const monthlyConversionsVal = Math.round(calcTraffic * 0.02 * 150); 

  const mainServices = [
    {
      icon: <Palette className="h-10 w-10 text-accent" />,
      title: 'Brand Logos & Identities',
      summary: 'Making your business look outstanding and established.',
      description: 'First impressions matter. We design distinctive logo systems, typography, color palettes, and full brand identities that make your business instantly recognizable and build trust with your customers.',
      bullets: [
        'Custom corporate and startup logos',
        'Premium color schemes & brand boards',
        'Cohesive font and typography systems',
        'Social media headers, assets & guidelines'
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-accent" />,
      title: 'Custom Websites & Apps',
      summary: 'Fast, functional, and fully responsive digital software.',
      description: 'We write clean, efficient code to build websites and web applications tailored exactly to your workflows. We do not use bloated page builders — everything is bespoke, secure, and optimized for speed.',
      bullets: [
        'Bespoke web applications and portals',
        'Fully responsive business websites',
        'High-converting landing pages',
        'E-commerce & custom database systems'
      ]
    },
    {
      icon: <Cpu className="h-10 w-10 text-accent" />,
      title: 'Automated Systems',
      summary: 'Eliminating manual work through intelligent software.',
      description: 'Tired of copy-pasting data across tools? We build custom automated systems that connect your email, CRM, spreadsheets, and databases together, handling data entry and syncs silently in the background.',
      bullets: [
        'API & database tool integrations',
        'Automated customer onboarding pipelines',
        'Instant notifications (Slack, SMS, email)',
        'Custom workflow triggers and webhooks'
      ]
    },
    {
      icon: <Share2 className="h-10 w-10 text-accent" />,
      title: 'Social Media Management',
      summary: 'Maintaining an active, engaging digital presence.',
      description: 'Your customers check your social media to see if you are active. We handle copywriting, graphic design, and automated scheduling for your channels, ensuring you have a steady stream of professional posts.',
      bullets: [
        'Content strategy & post layout designs',
        'Professional copywriting and hashtags',
        'Automated multi-platform scheduling',
        'Consistent brand messaging & aesthetics'
      ]
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Discovery & Consultation',
      desc: 'We sit down to learn about your business, identify operational bottlenecks, and analyze your brand styling.'
    },
    {
      num: '02',
      title: 'Blueprint & Strategy',
      desc: 'We outline the database architecture, design visual logo drafts, and create a workflow automation flowchart.'
    },
    {
      num: '03',
      title: 'Execution & Engineering',
      desc: 'Our studio writes clean code, refines brand aesthetics, connects your systems, and drafts content packs.'
    },
    {
      num: '04',
      title: 'Automation & Hand-off',
      desc: 'We run live integration tests, deploy websites, hand over branding packages, and teach you how to check logs.'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl space-y-24">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Our <span className="text-accent">Services</span>
        </h1>
        <p className="text-muted text-lg">
          We combine code, design, and automation to upgrade how your business operates and connects with customers.
        </p>
      </div>

      {/* Main Services Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {mainServices.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <GlassCard className="h-full flex flex-col justify-between p-8 hover:-translate-y-1 transition-all">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold">{service.title}</h3>
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider">{service.summary}</p>
                  </div>
                </div>

                <p className="text-muted text-sm leading-relaxed">{service.description}</p>

                <ul className="space-y-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  {service.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm">
                      <span className="p-0.5 rounded-full bg-accent/20 text-accent">
                        <Check size={12} className="stroke-[3]" />
                      </span>
                      <span className="text-text/90 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {service.title.includes('Automation') ? (
                  <Link to="/automation">
                    <Button className="w-full text-sm font-bold flex justify-center items-center gap-2">
                      Test Workflow Builder <ArrowRight size={14} />
                    </Button>
                  </Link>
                ) : service.title.includes('Brand') ? (
                  <Link to="/studio">
                    <Button className="w-full text-sm font-bold flex justify-center items-center gap-2">
                      Try Branding Canvas <ArrowRight size={14} />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/contact">
                    <Button className="w-full text-sm font-bold flex justify-center items-center gap-2">
                      Request Consultation <ArrowRight size={14} />
                    </Button>
                  </Link>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Interactive ROI Savings Calculator */}
      <section className="premium-card p-6 md:p-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                <TrendingUp size={14} />
                <span>Value Estimator</span>
              </span>
              <h2 className="text-3xl font-extrabold">Calculate Your Savings & Upgrade Value</h2>
              <p className="text-muted text-sm">
                Enter your current metrics below. See how automating tedious tasks and boosting brand visibility translates directly to recovered capital.
              </p>
            </div>

            <div className="space-y-4">
              {/* Slider 1: Hours Wasted */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold flex items-center gap-1.5"><Clock size={14} /> Manual Tasks (Hours/Week)</span>
                  <span className="text-accent font-extrabold">{calcHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={calcHours}
                  onChange={(e) => setCalcHours(parseInt(e.target.value))}
                  className="w-full accent-accent h-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 2: Average Employee Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold flex items-center gap-1.5"><Briefcase size={14} /> Hourly Operational Rate</span>
                  <span className="text-accent font-extrabold">${calcEmployeeCost} / Hour</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="150"
                  value={calcEmployeeCost}
                  onChange={(e) => setCalcEmployeeCost(parseInt(e.target.value))}
                  className="w-full accent-accent h-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 3: Monthly Website Traffic */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold flex items-center gap-1.5"><Globe size={14} /> Monthly Web Traffic</span>
                  <span className="text-accent font-extrabold">{calcTraffic.toLocaleString()} Visits</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={calcTraffic}
                  onChange={(e) => setCalcTraffic(parseInt(e.target.value))}
                  className="w-full accent-accent h-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-200/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-200/50 dark:border-slate-800/50 pb-3">Monthly Estimation</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted">Weekly Recovered</p>
                <p className="text-xl font-extrabold">{Math.round(calcHours * calcEmployeeCost)} USD</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted">Yearly Saved</p>
                <p className="text-xl font-extrabold text-accent">${yearlySavings.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 bg-accent/5 rounded-xl border border-accent/15 space-y-1">
              <p className="text-[10px] uppercase font-bold text-accent">Brand & Design Conversion Uplift</p>
              <p className="text-2xl font-black text-text">${monthlyConversionsVal.toLocaleString()} / mo</p>
              <p className="text-[10px] text-muted leading-tight">
                *Estimated value increase from converting visitor traffic into clients using a modern website layout and brand identity.
              </p>
            </div>

            <Link to="/contact" className="block">
              <Button className="w-full py-3 text-sm font-bold shadow-lg shadow-accent/25">
                Apply These Upgrades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Roadmap Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold">How We Build Together</h2>
          <p className="text-muted text-sm">
            We follow a structured design, engineering, and automation lifecycle to ship successful digital products.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-slate-200/20 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl space-y-3 hover:border-accent/40 transition-colors">
              <div className="text-4xl font-black text-accent/20 font-mono absolute top-4 right-4">{step.num}</div>
              <h4 className="text-lg font-bold pr-8">{step.title}</h4>
              <p className="text-muted text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
