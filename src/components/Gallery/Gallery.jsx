import { useEffect, useState } from 'react';
import { publicGet } from '../../api';
import './Gallery.css';
import img1 from '../../assets/fotos/plantandomacaxeira.jpeg';
import img2 from '../../assets/fotos/tirandoLeite.jpeg';
import img3 from '../../assets/frame1.png';
import img4 from '../../assets/fotos/palmeiraAcai.jpg';

const FALLBACK = [
  { id: 1, imagem: img1, legenda: 'Agricultura' },
  { id: 2, imagem: img2, legenda: 'Pesca com rede' },
  { id: 3, imagem: img3, legenda: 'Atividades Coopagri' },
  { id: 4, imagem: img4, legenda: 'Açaí' },
];

export default function Gallery() {
  const [fotos, setFotos] = useState(FALLBACK);

  useEffect(() => {
    publicGet('/galeria/')
      .then(data => {
        const items = Array.isArray(data) ? data : (data.results ?? []);
        if (items.length > 0) setFotos(items);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-layout">
        {fotos.map(foto => (
          <img
            key={foto.id}
            src={foto.imagem}
            alt={foto.legenda || 'Foto ATRPAP'}
            className="gallery-img"
          />
        ))}
      </div>
    </section>
  );
}
