import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import ServicesPage from "./pages/ServicesPage";
import Studio from "./pages/Studio"
import Automation from "./pages/Automation"
import ContactPage from "./pages/ContactPage"
import NotFound from "./pages/NotFound"
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="studio" element={<Studio />} />
        <Route path="automation" element={<Automation />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
