import React from 'react';
import { 
  Boxes, 
  Building, 
  Shield, 
  Trees, 
  Users, 
  Cpu, 
  Heart,
  Palette
} from 'lucide-react';

export const projectsData = [
  {
    id: 1,
    name: 'Ogbako Community Platform',
    category: ['development'],
    description: 'Designed and built a multi-tenant membership platform. The platform features automated dues tracking, secure member directories, custom financial reporting dashboards, and an engagement feed.',
    outcome: 'Supported 500+ active communities and automated the collection and verification of over ₦2 Billion in group dues.',
    client: 'Ogbako',
    tech: ['React', 'Next.js', 'Tailwind', 'Supabase', 'PostgreSQL'],
    accentColor: 'bg-[#082822]',
    icon: <Boxes className="h-5 w-5 text-[#3ecf8e]" />,
    website: 'https://ogbako-web.vercel.app/'
  },
  {
    id: 2,
    name: 'Riseborough Booking Hub',
    category: ['development', 'social'],
    description: 'Developed a luxury accommodation booking platform. Features seamless payment processing, calendar synchronization for serviced short-lets, and integration with local systems. We also manage their social channels to keep customers updated.',
    outcome: 'Enabled 24/7 online reservations with real-time room availability, leading to a 35% increase in occupancy.',
    client: 'Riseborough Apartments',
    tech: ['React', 'Tailwind CSS', 'Stripe', 'Node.js', 'Vercel', 'Social Media'],
    accentColor: 'bg-[#135B3A]',
    icon: <Building className="h-5 w-5 text-emerald-300" />,
    website: 'https://riseborough-website.vercel.app/',
    socials: {
      instagram: 'https://instagram.com/riseborough_apartments',
      facebook: 'https://facebook.com/riseborough_apartments'
    }
  },
  {
    id: 3,
    name: 'CareerPath Dashboard',
    category: ['automation'],
    description: 'Engineered a premium medical onboarding and credential verification dashboard. Automates profile verification, cover letter customization, and direct routing to partner hospital recruitment systems.',
    outcome: 'Successfully verified and placed 3,500+ healthcare specialists globally, reducing onboarding lag by 60%.',
    client: 'Global Care Pathways',
    tech: ['Next.js', 'Paystack API', 'Supabase', 'Node.js'],
    accentColor: 'bg-[#2563eb]',
    icon: <Shield className="h-5 w-5 text-blue-200" />,
    website: 'https://global-care-pathways.vercel.app/'
  },
  {
    id: 4,
    name: 'Premium Funeral E-commerce',
    category: ['development', 'social'],
    description: 'Developed a high-end e-commerce showcase for a premium casket manufacturer and funeral services organization established in 1984. Also manage their social channels to maintain a dignified, supportive community presence.',
    outcome: 'Digitalized their catalog structure, serving customers across Nigeria and boosting request volume by 45%.',
    client: 'George Wood Casket',
    tech: ['React', 'Tailwind', 'Vite', 'PWA', 'Netlify', 'Social Media'],
    accentColor: 'bg-[#135B3A]',
    icon: <Trees className="h-5 w-5 text-green-300" />,
    website: 'https://www.georgewoodcasket.com/',
    socials: {
      instagram: 'https://instagram.com/georgewoodcasket',
      facebook: 'https://facebook.com/georgewoodcasket',
      x: 'https://x.com/georgewoodcasket'
    }
  },
  {
    id: 5,
    name: 'OBEAG Tracker & Portal',
    category: ['automation'],
    description: 'Developed a members\' dashboard and financial contribution tracker. Automates invoice reconciliation, tracking of annual group dues, and SMS member notifications.',
    outcome: 'Replaced physical paper ledger books, achieving 100% database transparency for membership contributions.',
    client: 'OHA BU ENYI AGE GRADE',
    tech: ['Next.js', 'Tailwind', 'Twilio SMS API', 'PostgreSQL'],
    accentColor: 'bg-[#1e40af]',
    icon: <Users className="h-5 w-5 text-blue-300" />,
    website: 'https://ohabuenyi.vercel.app/'
  },
  {
    id: 6,
    name: 'AxiaStack Digital Presence',
    category: ['social'],
    description: 'Curated and managed the professional social media presence, visual assets, and marketing campaigns to build brand trust and drive inbound software consulting inquiries.',
    outcome: 'Achieved a 150% growth in organic impressions and generated highly qualified B2B leads through strategic content scheduling.',
    client: 'AxiaStack',
    tech: ['Social Media', 'Content Strategy', 'Copywriting', 'Design Templates'],
    accentColor: 'bg-[#0f172a]',
    icon: <Cpu className="h-5 w-5 text-indigo-400" />,
    website: 'https://axiastack.com/',
    socials: {
      instagram: 'https://instagram.com/axiastack',
      x: 'https://x.com/axiastack',
      linkedin: 'https://linkedin.com/company/axiastack'
    }
  },
  {
    id: 7,
    name: 'Ocubyte Content Strategy',
    category: ['social', 'branding'],
    description: 'Developed and executed Ocubyte\'s brand storytelling, social media graphic templates, and copywriting to establish industry authority in software development and automated workflows.',
    outcome: 'Maintained a consistent, high-value content posting schedule, increasing inbound discovery and engagement by 200%.',
    client: 'Ocubyte',
    tech: ['Content Marketing', 'Graphic Design', 'Social Scheduling', 'Brand Identity'],
    accentColor: 'bg-[#090d16]',
    icon: <Boxes className="h-5 w-5 text-[#3ecf8e]" />,
    website: 'https://www.ocubyte.org/',
    socials: {
      instagram: 'https://instagram.com/ocubyte',
      x: 'https://x.com/ocubyte',
      facebook: 'https://facebook.com/ocubyte',
      linkedin: 'https://linkedin.com/company/ocubyte'
    }
  },
  {
    id: 8,
    name: 'Ncheta Ndu Community Advocacy',
    category: ['social'],
    description: 'Designed social media advocacy assets, informative health check guides, and visual stories for Ncheta Ndu\'s health tracker and digital memorial platform.',
    outcome: 'Cultivated an engaged online support group of 2,000+ active followers and raised awareness for health preservation tools.',
    client: 'Ncheta Ndu',
    tech: ['Digital Advocacy', 'Health Tracking', 'Social Media Management', 'Copywriting'],
    accentColor: 'bg-[#4a044e]',
    icon: <Heart className="h-5 w-5 text-rose-300" />,
    website: 'https://nchetandu.com/',
    socials: {
      instagram: 'https://instagram.com/nchetandu',
      x: 'https://x.com/nchetandu',
      facebook: 'https://facebook.com/nchetandu',
      tiktok: 'https://tiktok.com/@nchetandu'
    }
  }
];
