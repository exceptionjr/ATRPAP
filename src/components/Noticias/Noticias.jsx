import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Noticias.css';

import assinaturaImg from '../../assets/noticias/assinatura.jpeg';
import contrucaoImg from '../../assets/noticias/contrucao.jpeg';

export const noticias = [
  {
    id: 'assinaturas-credito',
    categoria: 'Assinaturas',
    data: '29 Abr 2026',
    titulo: 'Assinaturas de contratos de linhas de crédito cedidas pelo Incra',
    resumo:
      'ATRPAP formaliza novas linhas de crédito para projetos de infraestrutura e produção no Assentamento Prata.',
    imagem: assinaturaImg,
    conteudo: (
      <>
        <p>
          <strong>Reforma Agrária: Incra e ATRPAP formalizam assinaturas de contratos de crédito no PA Prata</strong>
        </p>
        <p>
          <em>Ato solene marca a liberação de recursos essenciais para moradia e produção; famílias agora dão o próximo passo na estruturação de seus lotes.</em>
        </p>
        <p>
          <strong>SÃO JOÃO DO ARAGUAIA</strong> – O Instituto Nacional de Colonização e Reforma Agrária (Incra) e a Associação ATRPAP realizaram, nesta semana, a rodada oficial de assinaturas de contratos de linhas de crédito para as famílias do Projeto de Assentamento (PA) Prata. O evento é o marco jurídico que autoriza o repasse de recursos do Crédito Instalação, destinados à construção de habitações e ao fomento produtivo.
        </p>
        <p>
          A assinatura é uma etapa obrigatória para que o beneficiário tenha acesso aos valores, que são liberados via cartão magnético. Com o documento firmado, as famílias garantem a segurança jurídica necessária para iniciar a compra de materiais e a contratação de serviços sob supervisão técnica.
        </p>
        <h3>Modalidades Contratadas</h3>
        <p>Nesta etapa, as principais linhas formalizadas foram:</p>
        <ul>
          <li><strong>Habitacional:</strong> Recursos de até R$ 97,5 mil (em novas atualizações) para a construção da casa própria — <strong>R$ 107.000,00 por casa</strong>.</li>
          <li><strong>Reforma de casas:</strong> R$ 55.000,00</li>
          <li><strong>Apoio Inicial:</strong> Verba para aquisição de itens de primeira necessidade e ferramentas de trabalho.</li>
          <li><strong>Fomento Mulher:</strong> Crédito de até R$ 8 mil voltado especificamente para projetos produtivos liderados pelas mulheres assentadas.</li>
          <li><strong>Fomento:</strong> R$ 16 mil.</li>
          <li><strong>Fomento jovem:</strong> R$ 8 mil.</li>
          <li><strong>Fomento cacau:</strong> R$ 8 mil.</li>
          <li><strong>Fomento reflorestamento:</strong> R$ 8 mil.</li>
        </ul>
        <h3>Transparência e Próximos Passos</h3>
        <p>
          De acordo com a Superintendência Regional do Incra em Marabá, a coleta das assinaturas permite a atualização do Sistema de Informações de Projetos de Reforma Agrária (Sipra), combatendo irregularidades e garantindo que o dinheiro chegue a quem realmente vive e produz no lote.
        </p>
        <p>
          Após a assinatura, o cronograma segue com a liberação das parcelas conforme o avanço das obras e a prestação de contas de cada projeto.
        </p>
        <h3>Links Úteis para o Assentado:</h3>
        <ul>
          <li>
            <a href="https://saladacidadania.incra.gov.br/" target="_blank" rel="noopener noreferrer">Acompanhamento de Crédito</a>: Verifique o status do seu contrato na Sala da Cidadania.
          </li>
          <li>
            <a href="https://www.in.gov.br/" target="_blank" rel="noopener noreferrer">Novas Regras</a>: Confira a Instrução Normativa nº 151/2025 sobre as atualizações no Crédito Instalação.
          </li>
          <li>
            <a href="https://pgt.incra.gov.br/" target="_blank" rel="noopener noreferrer">Consulta de Cadastro</a>: Acesse a Plataforma de Governança Territorial (PGT) para emitir seu CCU (Contrato de Concessão de Uso).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'construcao-casas',
    categoria: 'Construção',
    data: '28 Abr 2026',
    titulo: 'ATRPAP constrói casas do Incra no Projeto de Assentamento Prata',
    resumo:
      'Projeto habitacional avança com a construção de novas casas para famílias assentadas, contando com apoio técnico e recursos do Incra.',
    imagem: contrucaoImg,
    conteudo: (
      <>
        <p>
          <strong>Habitação: Novas moradias avançam no PA Prata via ATRPAP e Incra</strong>
        </p>
        <p>
          <strong>SÃO JOÃO DO ARAGUAIA</strong> – Famílias do Projeto de Assentamento (PA) Prata estão sendo beneficiadas com a construção de novas casas, em uma iniciativa que une a ATRPAP e o Incra. O projeto utiliza recursos do Crédito Instalação para garantir infraestrutura e dignidade às famílias da reforma agrária.
        </p>
        <h3>Destaques do Projeto:</h3>
        <ul>
          <li><strong>Estrutura:</strong> Unidades com dois quartos, sala, cozinha, banheiro e área de serviço.</li>
          <li><strong>Investimento:</strong> Parte de um pacote de R$ 75 milhões destinados à habitação rural no Pará.</li>
          <li><strong>Execução:</strong> Gestão compartilhada entre associação local e supervisão técnica do Incra Marabá.</li>
        </ul>
        <p>
          O avanço das obras reforça o compromisso em fixar as famílias no campo com qualidade de vida, transformando o PA Prata em referência de desenvolvimento habitacional no sudeste paraense.
        </p>
        <h3>Links para acompanhamento:</h3>
        <ul>
          <li>
            <a href="https://pgt.incra.gov.br/" target="_blank" rel="noopener noreferrer">Consulta de Beneficiários</a>: Veja a lista de assentados na Plataforma de Governança Territorial.
          </li>
          <li>
            <a href="https://www.gov.br/incra/pt-br" target="_blank" rel="noopener noreferrer">Editais e Seleções</a>: Acompanhe novos editais na página do Incra Marabá.
          </li>
          <li>
            <a href="https://saladacidadania.incra.gov.br/" target="_blank" rel="noopener noreferrer">Serviços de Crédito</a>: Informações sobre o Crédito Instalação na Sala da Cidadania.
          </li>
        </ul>
      </>
    ),
  },
];

export default function Noticias() {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const total = noticias.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCount(1);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prev = () => {
    if (total === 0) return;
    setCurrent((c) => (c - 1 + total) % total);
  };

  const next = () => {
    if (total === 0) return;
    setCurrent((c) => (c + 1) % total);
  };

  const getVisible = () => {
    const count = Math.min(visibleCount, total);
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(noticias[(current + i) % total]);
    }
    return items;
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
                  <Link to={`/noticia/${noticia.id}`} className="noticia-card" key={noticia.id || index} style={{ textDecoration: 'none' }}>
                    <div className="noticia-img-wrapper">
                      <img src={noticia.imagem} alt={noticia.titulo} />
                      <span className="noticia-categoria">{noticia.categoria}</span>
                    </div>
                    <div className="noticia-body">
                      <span className="noticia-data">{noticia.data}</span>
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
