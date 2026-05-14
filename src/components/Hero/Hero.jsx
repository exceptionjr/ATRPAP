
import './Hero.css';
import bannerImg from '../../assets/fotos/background.png';

export default function Hero() {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${bannerImg})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>ATRPAP</h1>
        <h2>A Associação dos trabalhadores do Projeto de  Assentamento Prata</h2>
        <p>Fortalecendo da agricultura famliar

        </p>
      </div>
    </section>
  );
}
