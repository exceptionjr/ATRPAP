
import './FaleConosco.css';
import whatsappIcon from '../../assets/logos_whatsapp-icon.png';

export default function FaleConosco() {
  return (
    <section id="fale-conosco" className="fale-section">
      <div className="fale-container">
        <h2 className="fale-titulo">Fale Conosco</h2>

        <div className="fale-card">
          <img src={whatsappIcon} alt="WhatsApp" className="fale-whatsapp-icon" />
          <p className="fale-texto">
            Estamos à disposição para apresentar os benefícios de se tornar um cooperado ATRPAP. 
            Contribua para a evolução do setor produtivo no Pará e alcance novos patamares. 
            Entre em contato conosco pelo Whatsapp e agende uma conversa.
            </p>
          <a
            href="https://api.whatsapp.com/send/?phone=5594981376737&text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20trabalho%20da%20ATRPAP%20e%20quais%20são%20os%20requisitos%20para%20me%20tornar%20um%20associado"
            target="_blank"
            rel="noopener noreferrer"
            className="fale-btn"
          >
            &#128172; Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
