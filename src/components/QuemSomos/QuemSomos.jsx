
import './QuemSomos.css';
import mapaImg from '../../assets/mapa.jpg';

export default function QuemSomos() {
  return (
    <section id="quem-somos" className="quem-somos-section">
      <div className="quem-somos-container">
        <div className="quem-somos-content">
          <h2>Quem Somos?</h2>
          <div className="divider"></div>
          <p>
            A Associação dos trabalhadores do Projeto de  Assentamento Prata,
            formada por 125 famílias assentadas pelo Incra, no Município de
            São João do Araguaia, tem como objetivo, a melhoria da condição
            de vida dos agricultores familiares. Perseguindo sempre a diversificação
            de renda, respeitando o meio ambiente, num sistema de cultivo sustentável.
          </p>
          <p>Nos tornamos uma entidade com abrangência em todo o Município de São João do Araguaia, fortalecida com o Título de Utilidade Pública Estadual proposto pelo Deputado Estadual Dirceu Ten Caten e aprovado pela Assembleia Legislativa do Estado do Pará, e sancionada pelo Governador Herder Barbalho.
            Desta forma, abriu-se o caminho para grandes conquistas pelos agricultores familiares, podendo receber emendas parlamentares, assinar convênios, gerenciar recursos de entidades beneficentes, e assim, procurar a melhora do aumento do nível tecnológico de seus associados, levando-os à prosperidade, melhorando suas condições de vida, com a diversificação de renda nas propriedades, através de máquinas e equipamentos adequados às culturas produzidas, e a produção de carne, leites e piscicultura, bem como produção de aves e mel, sempre procurando agregar valor em tudo o que se produz, verticalizando a produção.</p>
          {/* <p>
            Com valores baseados na cooperação, transparência e respeito ao meio ambiente, 
            construímos uma rede sólida de apoio
            que beneficia dezenas de famílias e movimenta a economia local.
          </p> */}
        </div>
        <div className="quem-somos-image">
          <img src={mapaImg} alt="Mapa do local" title="Mapa do local" />
          {/* <button
            className="mapa-voltar-btn"
            onClick={() => {
              const documentosSection = document.getElementById('documentos');
              if (documentosSection) {
                documentosSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Voltar aos documentos"
          >
            Voltar aos Documentos
          </button> */}
        </div>
      </div>
    </section>
  );
}
