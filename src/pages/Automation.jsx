import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Zap, 
  Play, 
  ArrowRight, 
  Database, 
  Mail, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Layers,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowDown
} from 'lucide-react';

const preBuiltNodes = {
  triggers: [
    { type: 'stripe', label: 'Stripe Payment', desc: 'Fires when a customer completes checkout.', icon: <Zap size={16} className="text-amber-400" /> },
    { type: 'form', label: 'Website Contact Form', desc: 'Fires when a new contact inquiry is submitted.', icon: <Layers size={16} className="text-cyan-400" /> },
    { type: 'webhook', label: 'Custom REST Webhook', desc: 'Receive instant data from external APIs.', icon: <Cpu size={16} className="text-violet-400" /> }
  ],
  actions: [
    { type: 'email', label: 'Send Transactional Email', desc: 'Sends customized email via Resend / Sendgrid.', icon: <Mail size={16} className="text-emerald-400" /> },
    { type: 'slack', label: 'Send Slack Notification', desc: 'Dispatches instant logs to #team channels.', icon: <MessageSquare size={16} className="text-rose-400" /> },
    { type: 'db', label: 'Create Record in Database', desc: 'Logs lead data directly to Supabase.', icon: <Database size={16} className="text-indigo-400" /> }
  ]
};

const Automation = () => {
  const [pipeline, setPipeline] = useState([
    { id: '1', type: 'stripe', label: 'Stripe Payment', desc: 'Fires when a customer completes checkout.', isTrigger: true, icon: <Zap size={16} className="text-amber-400" /> },
    { id: '2', type: 'db', label: 'Create Record in Database', desc: 'Logs lead data directly to Supabase.', isTrigger: false, icon: <Database size={16} className="text-indigo-400" /> },
    { id: '3', type: 'email', label: 'Send Transactional Email', desc: 'Sends customized email via Resend / Sendgrid.', isTrigger: false, icon: <Mail size={16} className="text-emerald-400" /> }
  ]);

  const [activeTab, setActiveTab] = useState('triggers');
  const [simState, setSimState] = useState('idle'); // idle, running, step-1, step-2, step-3, completed
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [logs, setLogs] = useState(['[System] Pipeline Ready. Waiting for Trigger...']);

  const addNode = (node) => {
    if (pipeline.length >= 6) {
      alert("Let's keep the demo workflow to a maximum of 6 steps!");
      return;
    }
    const newNode = {
      ...node,
      id: Date.now().toString(),
      isTrigger: false
    };
    setPipeline([...pipeline, newNode]);
    setLogs([...logs, `[Pipeline] Added Action: "${node.label}"`]);
  };

  const removeNode = (id, isTrigger) => {
    if (isTrigger) {
      alert("You need a trigger block to initiate an automation workflow!");
      return;
    }
    setPipeline(pipeline.filter(node => node.id !== id));
    setLogs([...logs, `[Pipeline] Removed Action node.`]);
  };

  const setTrigger = (node) => {
    const updated = [...pipeline];
    updated[0] = {
      ...node,
      id: Date.now().toString(),
      isTrigger: true
    };
    setPipeline(updated);
    setLogs([`[Pipeline] Updated Trigger to: "${node.label}"`, ...logs]);
  };

  const runSimulation = () => {
    if (pipeline.length < 2) {
      alert("Please add at least one Action node to your pipeline!");
      return;
    }
    setSimState('running');
    setActiveStepIdx(0);
    setLogs([`⚡ [EXECUTION] Triggering pipeline via "${pipeline[0].label}"`]);

    // Iterate through steps with timing delays
    pipeline.forEach((node, idx) => {
      setTimeout(() => {
        setActiveStepIdx(idx);
        let logMsg = '';
        if (idx === 0) {
          logMsg = `📥 [INCOMING] Payload received: { customer: "Jane Doe", amount: "₦150,000.00", status: "succeeded" }`;
        } else {
          switch (node.type) {
            case 'email':
              logMsg = `✉️ [API Resend] Sending greeting template to client: jane@example.com`;
              break;
            case 'slack':
              logMsg = `💬 [API Slack] Dispatched alert: "New checkout registered - ₦150,000.00!"`;
              break;
            case 'db':
              logMsg = `💾 [DB Supabase] Inserted record into "checkouts" table: Row ID #${Math.floor(Math.random() * 9000) + 1000}`;
              break;
            default:
              logMsg = `⚙️ [EXEC] Handled active node module: "${node.label}"`;
          }
        }
        setLogs(prev => [logMsg, ...prev]);

        if (idx === pipeline.length - 1) {
          setTimeout(() => {
            setSimState('completed');
            setActiveStepIdx(-1);
            setLogs(prev => [`✅ [SUCCESS] Pipeline execution finished. All API requests returned HTTP 200.`, ...prev]);
          }, 1200);
        }
      }, (idx + 1) * 1200);
    });
  };

  const resetSimulation = () => {
    setSimState('idle');
    setActiveStepIdx(-1);
    setLogs(['[System] Pipeline Reset. Waiting for Trigger...']);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl space-y-16">
      {/* Title Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold">
          <Sparkles size={12} />
          <span>Interactive Automation Lab</span>
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Visual <span className="text-accent">Automation Studio</span>
        </h1>
        <p className="text-muted text-base">
          Connect your workflows, automate data movements, and save hours of administrative tasks. Drag-and-drop or select blocks below to test a live simulation.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar: Toolbox */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card p-6 space-y-4">
            <h3 className="text-lg font-bold">Toolbox</h3>
            
            <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              <button
                onClick={() => setActiveTab('triggers')}
                className={`flex-1 pb-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'triggers' ? 'text-accent border-b-2 border-accent' : 'text-muted'
                }`}
              >
                Triggers
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 pb-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'actions' ? 'text-accent border-b-2 border-accent' : 'text-muted'
                }`}
              >
                Actions
              </button>
            </div>

            <div className="space-y-3 min-h-[220px]">
              {activeTab === 'triggers' ? (
                preBuiltNodes.triggers.map((node, i) => (
                  <div
                    key={i}
                    onClick={() => setTrigger(node)}
                    className="p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/10 dark:bg-slate-900/10 hover:border-accent/40 cursor-pointer transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-accent/5 border border-accent/15 flex-shrink-0">
                      {node.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold flex items-center gap-1">
                        {node.label}
                        <span className="text-[9px] bg-accent/15 px-1.5 py-0.5 rounded text-accent font-medium">Use Trigger</span>
                      </h4>
                      <p className="text-[10px] text-muted leading-tight">{node.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                preBuiltNodes.actions.map((node, i) => (
                  <div
                    key={i}
                    onClick={() => addNode(node)}
                    className="p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/30 bg-slate-200/10 dark:bg-slate-900/10 hover:border-accent/40 cursor-pointer transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-accent/5 border border-accent/15 flex-shrink-0">
                      {node.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold flex items-center gap-1">
                        {node.label}
                        <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-muted font-medium">+ Add</span>
                      </h4>
                      <p className="text-[10px] text-muted leading-tight">{node.desc}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[10px] text-muted italic text-center">
              *Click nodes to swap the trigger or insert actions into the workflow.
            </p>
          </div>

          {/* Action Trigger Box */}
          <div className="premium-card p-6 space-y-4">
            <h3 className="text-lg font-bold">Execution Control</h3>
            <div className="space-y-2">
              <button
                onClick={runSimulation}
                disabled={simState === 'running'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent text-white font-extrabold hover:bg-accent/90 transition shadow-lg shadow-accent/15 disabled:opacity-50"
              >
                <Play size={16} />
                <span>Run Live Webhook Simulator</span>
              </button>
              {simState !== 'idle' && (
                <button
                  onClick={resetSimulation}
                  className="w-full py-2 border border-slate-200/40 dark:border-slate-800/40 rounded-xl text-xs font-bold hover:bg-slate-200/20 dark:hover:bg-slate-800/20 transition"
                >
                  Clear Console Logs
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visual Canvas and Logs Panel */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Node Canvas */}
          <div className="premium-card p-6 md:p-8 flex flex-col justify-between flex-grow min-h-[350px]">
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-bold">Active Pipeline Canvas</h3>
              <p className="text-muted text-xs">
                Your automation pipeline executes sequentially from top to bottom.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 relative py-4">
              <AnimatePresence>
                {pipeline.map((node, index) => {
                  const isActive = activeStepIdx === index;
                  return (
                    <React.Fragment key={node.id}>
                      {index > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="text-muted/50 my-0.5"
                        >
                          <ArrowDown size={18} className={isActive ? 'text-accent animate-bounce' : ''} />
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`w-full max-w-md p-4 rounded-2xl border transition-all flex justify-between items-center ${
                          isActive 
                            ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10 scale-[1.02]' 
                            : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-200/10 dark:bg-slate-900/10'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-xl border ${
                            isActive ? 'bg-accent/20 border-accent' : 'bg-slate-200/30 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-800/40'
                          }`}>
                            {node.icon}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold flex items-center gap-2">
                              {node.label}
                              {node.isTrigger && (
                                <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-500 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  Trigger
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-muted leading-tight">{node.desc}</p>
                          </div>
                        </div>

                        {!node.isTrigger && (
                          <button
                            onClick={() => removeNode(node.id, node.isTrigger)}
                            className="p-1.5 text-muted hover:text-rose-500 transition-colors focus:outline-none"
                            aria-label="Remove node"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-4 mt-6 flex justify-between text-xs text-muted">
              <span>Steps: {pipeline.length} / 6</span>
              <span className="capitalize">Status: {simState}</span>
            </div>
          </div>

          {/* Logs panel */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-emerald-400 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-2 text-slate-500 font-bold uppercase tracking-wider flex justify-between items-center">
              <span>API Execution Stream Console</span>
              {simState === 'running' && (
                <span className="text-amber-400 animate-pulse text-[10px] tracking-widest font-sans">
                  RUNNING PIPELINE...
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto flex flex-col-reverse">
              {logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${
                    log.includes('✅') ? 'text-emerald-400 font-bold' :
                    log.includes('⚡') ? 'text-amber-400 font-bold' :
                    log.includes('[System]') || log.includes('[Pipeline]') ? 'text-slate-500' : 'text-cyan-400'
                  }`}
                >
                  {log}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info FAQs */}
      <section className="premium-card p-8 md:p-12 space-y-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-extrabold text-center">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-accent flex items-center gap-2">
              <Clock size={16} /> How much time does automation save?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              On average, our client partners recover between 10 to 30 hours per week. By connecting forms, checkouts, and spreadsheets directly, you eliminate the need to manually copy records.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-accent flex items-center gap-2">
              <Cpu size={16} /> What tools can you automate?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Almost anything with a API. We regularly build custom webhook listeners for Stripe, Hubspot, Shopify, WhatsApp, Slack, Gmail, Google Sheets, Airtable, and database servers like Supabase.
            </p>
          </div>
        </div>
        <div className="pt-4 text-center">
          <Link to="/contact">
            <Button className="font-bold px-8 py-3.5">
              Request a Custom Workflow Setup
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Automation;
