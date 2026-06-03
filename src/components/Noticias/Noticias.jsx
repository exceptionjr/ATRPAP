import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicGet } from '../../api';
import './Noticias.css';

const CATEGORIA_LABEL = {
  assinaturas: 'Assinaturas',
  construcao:  'Construção',
  producao:    'Produção',
  credito:     'Crédito',
  eventos:     'Eventos',
  geral:       'Geral',
};

function formatarData(dateStr) {
  if (!dateStr) return '';
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day)} ${meses[parseInt(month) - 1]} ${year}`;
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    publicGet('/noticias/')
      .then(data => setNoticias(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => setVisibleCount(window.innerWidth <= 768 ? 1 : 3);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = noticias.length;
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  const getVisible = () => {
    const count = Math.min(visibleCount, total);
    return Array.from({ length: count }, (_, i) => noticias[(current + i) % total]);
  };

  return (
    <section id="noticias" className="noticias-section">
      <div className="noticias-container">
        <div className="noticias-header">
          <h2>Notícias</h2>
          <p>Fique por dentro das últimas novidades e iniciativas da ATRPAP</p>
        </div>

        {noticias.length === 0 ? (
          <div className="noticias-empty">
            <p>Não há notícias disponíveis no momento.</p>
            <p>Volte em breve para acompanhar as novidades da ATRPAP.</p>
          </div>
        ) : (
          <>
            <div className="noticias-carousel-wrapper">
              <button className="noticias-btn" onClick={prev} aria-label="Anterior">
                &#10094;
              </button>

              <div className="noticias-track">
                {getVisible().map((noticia, index) => (
                  <Link
                    to={`/noticia/${noticia.id}`}
                    className="noticia-card"
                    key={noticia.id ?? index}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="noticia-img-wrapper">
                      {noticia.imagem && <img src={noticia.imagem} alt={noticia.titulo} />}
                      <span className="noticia-categoria">
                        {CATEGORIA_LABEL[noticia.categoria] ?? noticia.categoria}
                      </span>
                    </div>
                    <div className="noticia-body">
                      <span className="noticia-data">{formatarData(noticia.data)}</span>
                      <h3>{noticia.titulo}</h3>
                      <p>{noticia.resumo}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <button className="noticias-btn" onClick={next} aria-label="Próximo">
                &#10095;
              </button>
            </div>

            <div className="noticias-dots">
              {noticias.map((_, i) => (
                <button
                  key={i}
                  className={`noticias-dot ${i === current ? 'active' : ''}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir para notícia ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
