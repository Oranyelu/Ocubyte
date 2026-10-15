import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import Automation from './pages/Automation';
import Studio from './pages/Studio';
import PayPage from './pages/PayPage';
import GatewayPortal from './pages/GatewayPortal';
import GatewayCheckout from './pages/GatewayCheckout';
import GatewayDemoCallback from './pages/GatewayDemoCallback';
import MerchantPortal from './pages/MerchantPortal';
import AuthPortal from './pages/AuthPortal';
import MasterAdminPortal from './pages/MasterAdminPortal';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/pay" element={<PayPage />} />
        <Route path="/gateway" element={<GatewayPortal />} />
        <Route path="/gateway/checkout" element={<GatewayCheckout />} />
        <Route path="/gateway/demo-callback" element={<GatewayDemoCallback />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/admin" element={<MasterAdminPortal />} />
        <Route path="/merchant" element={<MerchantPortal />} />
        <Route path="/merchant/dashboard" element={<MerchantPortal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
