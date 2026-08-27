import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Building,
  User,
  Settings,
  Send
} from 'lucide-react';

const ContactPage = () => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    businessName: '',
    challenge: '',
    clientName: '',
    email: '',
    urgency: 'standard' // urgent, standard, future
  });

  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && selectedServices.length === 0) {
      alert("Please select at least one service to proceed!");
      return;
    }
    if (step === 2 && !formData.businessName.trim()) {
      alert("Please enter your business name!");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.email.trim()) {
      alert("Please fill in your name and email address!");
      return;
    }
    // Simulation: Submit data
    setStep(4);
  };

  const servicesOpts = [
    { id: 'logo', label: 'Brand Logos & Identities', desc: 'Design logos, color styles, and complete brand kits.' },
    { id: 'web', label: 'Custom Websites & Apps', desc: 'Build responsive websites, portals, and custom apps.' },
    { id: 'auto', label: 'Automated Systems', desc: 'Connect apps, automate sheets, trigger notifications.' },
    { id: 'social', label: 'Social Media Management', desc: 'Schedule content, write copywriting, design assets.' }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl space-y-16">
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Partner <span className="text-accent">with Us</span>
        </h1>
        <p className="text-muted text-base">
          Let’s construct a modern identity, automate your manual operations, and deploy high-performance code. Complete our quick onboarding questionnaire to get started.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Onboarding Configurator Card */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 md:p-8 min-h-[440px] flex flex-col justify-between relative overflow-hidden">
            {/* Step Progress Tracker */}
            {step < 4 && (
              <div className="flex justify-between items-center mb-8 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                <span className="text-xs uppercase font-extrabold text-accent">Questionnaire Onboarding</span>
                <span className="text-xs font-mono font-bold">Step {step} of 3</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold">Which services do you wish to upgrade?</h3>
                    <p className="text-muted text-xs">Select all matching operational upgrades.</p>
                  </div>

                  <div className="grid gap-3">
                    {servicesOpts.map((opt) => {
                      const isSelected = selectedServices.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleService(opt.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${isSelected
                              ? 'border-accent bg-accent/5'
                              : 'border-slate-200/30 dark:border-slate-800/30 bg-slate-200/5 dark:bg-slate-900/5 hover:border-accent/35'
                            }`}
                        >
                          <div className="space-y-0.5 pr-4">
                            <h4 className="text-xs font-bold">{opt.label}</h4>
                            <p className="text-[10px] text-muted leading-tight">{opt.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-accent border-accent text-white' : 'border-slate-400 dark:border-slate-700'
                            }`}>
                            {isSelected && <Check size={12} className="stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={nextStep} className="text-sm font-bold flex items-center gap-1">
                      Continue <ArrowRight size={14} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold">Tell us about your business</h3>
                    <p className="text-muted text-xs">Provide context so we can prepare suggestions.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                        <Building size={12} /> Company Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 premium-input text-sm"
                        placeholder="Apex Brands LLC"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                        <Settings size={12} /> Primary Goal or Challenge
                      </label>
                      <textarea
                        name="challenge"
                        value={formData.challenge}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2.5 premium-input text-sm"
                        placeholder="We want to automate lead ingestion and redesign our logo to look more modern."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button onClick={prevStep} className="text-xs font-bold text-muted flex items-center gap-1 hover:underline">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <Button onClick={nextStep} className="text-sm font-bold flex items-center gap-1">
                      Continue <ArrowRight size={14} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <form key="step-3" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold">Who should we contact?</h3>
                    <p className="text-muted text-xs">Your preferred coordinates so we can reach out.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                        <User size={12} /> Your Name
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 premium-input text-sm"
                        placeholder="Jane Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted flex items-center gap-1">
                        <Mail size={12} /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 premium-input text-sm"
                        placeholder="jane@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted">Project Urgency</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['immediate', 'standard', 'exploring'].map(u => (
                          <button
                            type="button"
                            key={u}
                            onClick={() => setFormData(prev => ({ ...prev, urgency: u }))}
                            className={`py-2 px-3 rounded-lg border text-xs font-bold capitalize transition-all ${formData.urgency === u
                                ? 'border-accent bg-accent/5 text-accent'
                                : 'border-slate-200/30 dark:border-slate-800/30 text-muted'
                              }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="text-xs font-bold text-muted flex items-center gap-1 hover:underline">
                      <ArrowLeft size={14} /> Back
                    </button>
                    <Button type="submit" className="text-sm font-bold flex items-center gap-2">
                      Submit Partner Request <Send size={14} />
                    </Button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500">
                    <Check size={32} className="stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">Partner Inquiry Received!</h3>
                    <p className="text-muted text-sm max-w-sm mx-auto">
                      Thank you, {formData.clientName}. We will review the details for {formData.businessName} and schedule your free visual logo mockup & workflow audit within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setStep(1);
                        setSelectedServices([]);
                        setFormData({ businessName: '', challenge: '', clientName: '', email: '', urgency: 'standard' });
                      }}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* Studio Contacts Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="premium-card p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Direct Channels</h3>
              <p className="text-muted text-xs">Reach our lead developers and branding specialists directly.</p>
            </div>

            <div className="space-y-4 font-semibold text-xs">
              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/5 dark:bg-slate-900/5">
                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold">Client Support</p>
                  <p className="text-text/90">ocubyte@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/5 dark:bg-slate-900/5">
                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold">General Inquiry</p>
                  <p className="text-text/90">+234 912 361 4202</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/5 dark:bg-slate-900/5">
                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold">HQ Location</p>
                  <p className="text-text/90">Abuja, Federal Capital Territory, Nigeria.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/5 dark:bg-slate-900/5">
                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <Building size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold">CAC Registration</p>
                  <p className="text-text/90">RC - 9677104</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick statement */}
          <div className="premium-card p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="text-accent" size={18} />
              We Byte Hard.
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Every partnership starts with a completely free consultation. We review your existing codebase, design logo vectors, audit active operational sheets, and draft visual roadmap blueprints. No upfront commitments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
