import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public site
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Gallery from './components/Gallery/Gallery';
import QuemSomos from './components/QuemSomos/QuemSomos';
import OQueFazemos from './components/OQueFazemos/OQueFazemos';
import Noticias from './components/Noticias/Noticias';
import FaleConosco from './components/FaleConosco/FaleConosco';
import Contatos from './components/Contatos/Contatos';
import BackToTop from './components/BackToTop/BackToTop';
import Transparencia from './components/Trasparencia/Transparencia';
import Documentos from './components/Documentos/Documentos';
import NoticiaDetalhe from './components/NoticiaDetalhe/NoticiaDetalhe';

// Admin panel
import LoginPage from './admin/LoginPage';
import ProtectedRoute from './admin/ProtectedRoute';
import NoticiasAdmin from './admin/pages/NoticiasAdmin';
import GaleriaAdmin from './admin/pages/GaleriaAdmin';
import DocumentosAdmin from './admin/pages/DocumentosAdmin';
import ProjetosAdmin from './admin/pages/ProjetosAdmin';
import LinhasAdmin from './admin/pages/LinhasAdmin';
import ProtocolosAdmin from './admin/pages/ProtocolosAdmin';
import ExcecoesAdmin from './admin/pages/ExcecoesAdmin';

import './index.css';
import './components/Documentos/Documentos.css';

function Home() {
  return (
    <>
      <main>
        <Hero />
        <Gallery />
        <QuemSomos />
        <OQueFazemos />
        <Noticias />
        <FaleConosco />
      </main>
      <Contatos />
      <BackToTop />
    </>
  );
}

function PublicSite() {
  return (
    <div className="landing-page">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/noticia/:id" element={<NoticiaDetalhe />} />
      </Routes>
    </div>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="noticias" element={<ProtectedRoute><NoticiasAdmin /></ProtectedRoute>} />
      <Route path="galeria" element={<ProtectedRoute><GaleriaAdmin /></ProtectedRoute>} />
      <Route path="documentos" element={<ProtectedRoute><DocumentosAdmin /></ProtectedRoute>} />
      <Route path="projetos" element={<ProtectedRoute><ProjetosAdmin /></ProtectedRoute>} />
      <Route path="linhas" element={<ProtectedRoute><LinhasAdmin /></ProtectedRoute>} />
      <Route path="protocolos" element={<ProtectedRoute><ProtocolosAdmin /></ProtectedRoute>} />
      <Route path="excecoes" element={<ProtectedRoute><ExcecoesAdmin /></ProtectedRoute>} />
      <Route index element={<Navigate to="noticias" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/gestao/*" element={<AdminRoutes />} />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}
