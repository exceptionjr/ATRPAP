import { useState } from 'react';
import './OQueFazemos.css';

import img1 from '../../assets/image 1.png';
import img3 from '../../assets/image 3.png';
import img7 from '../../assets/image 7.png';
import img2 from "../../assets/fotos/a.jpeg";
import img4 from "../../assets/trator.png";

const servicos = [
  {
    titulo: 'Regularização Fundiária',
    descricao: 'Titulação de propriedades para garantir segurança jurídica e dar acesso a crédito',
    imagem: img1,
  },
  {
    titulo: 'Fortalecimento da Agricultura Familiar',
    descricao: 'Projetos de Créditos Produtivos e Ambientais através de cooperação técnica com o INCRA.',
    imagem: img2,
  },
  {
    titulo: 'Crédito Habitação Rural',
    descricao: 'Recursos voltados para a construção e reforma de casas nos lotes associados',
    imagem: img7,
  },
  {
    titulo: 'Captação de recursos para aquisição de máquinas e equipamentos',
    descricao: 'gestão de emendas e parcerias para aquisição de máquinas que modernizam o trabalho no campo',
    imagem: img4, // Nota: Substituir por foto específica da associação
  },
  {
    titulo: 'Assistência Técnica Especializada',
    descricao: 'Suporte profissional direto com supervisão de profissionais Agrônomos e Veterinários.',
    imagem: img3, // Nota: Substituir por foto específica da associação
  },
];
const VISIBLE = 3;

export default function OQueFazemos() {
  const [current, setCurrent] = useState(0);
  const total = servicos.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const getVisible = () => {
    const items = [];
    for (let i = 0; i < VISIBLE; i++) {
      items.push(servicos[(current + i) % total]);
    }
    return items;
  };

  return (
    <section id="o-que-fazemos" className="oqf-section">
      <div className="oqf-container">
        <div className="oqf-header">
          <h2>O que fazemos?</h2>
          <p>Nossas frentes de atuação em prol da agricultura familiar e do produtor rural no Pará</p>
        </div>

        <div className="oqf-carousel-wrapper">
          <button className="oqf-carousel-btn" onClick={prev} aria-label="Anterior">
            &#10094;
          </button>

          <div className="oqf-carousel-track">
            {getVisible().map((servico, index) => (
              <div className="oqf-card" key={index}>
                <div className="oqf-image-circle">
                  <img src={servico.imagem} alt={servico.titulo} />
                </div>
                <h3>{servico.titulo}</h3>
                <p>{servico.descricao}</p>
              </div>
            ))}
          </div>

          <button className="oqf-carousel-btn" onClick={next} aria-label="Próximo">
            &#10095;
          </button>
        </div>

        <div className="oqf-dots">
          {servicos.map((_, i) => (
            <button
              key={i}
              className={`oqf-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para item ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
