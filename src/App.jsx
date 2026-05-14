import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Gallery from './components/Gallery/Gallery';
import QuemSomos from './components/QuemSomos/QuemSomos';
import OQueFazemos from './components/OQueFazemos/OQueFazemos';
import Noticias from './components/Noticias/Noticias';
import FaleConosco from './components/FaleConosco/FaleConosco';
import Contatos from './components/Contatos/Contatos';
import BackToTop from './components/BackToTop/BackToTop';
import './index.css';
import Transparencia from './components/Trasparencia/Transparencia';
import Documentos from './components/Documentos/Documentos';
import './components/Documentos/Documentos.css';
import NoticiaDetalhe from './components/NoticiaDetalhe/NoticiaDetalhe';

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

function App() {
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

export default App;
