
import './Contatos.css';
import iconLocation from '../../assets/Group.svg';
import iconPhone from '../../assets/ic_outline-call.svg';
import iconEmail from '../../assets/material-symbols_mail-outline.svg';

export default function Contatos() {
  return (
    <footer id="contatos" className="ct-footer">

      {/* ── Corpo principal ── */}
      <div className="ct-body">

        {/* Esquerda — informações */}
        <div className="ct-info">
          <h3 className="ct-titulo">Nossos Contatos</h3>

          <div className="ct-item">
            <img src={iconLocation} alt="Endereço" className="ct-icon-img" />
            <div className="ct-item-text">
              <strong>Endereço</strong>
              <span>PA/Prata - Rodovia Pedro Carneiro km.07
               Zona Rural com acesso no km. 40 da Rod. Transamazônica   </span>
              <span>Município de São João do Araguaia Estado do Pará</span>
            </div>
          </div>

          <div className="ct-item">
            <img src={iconPhone} alt="Telefone" className="ct-icon-img" />
            <div className="ct-item-text">
              <strong>Contato</strong>
              <span>(94) 98137-6737</span>
            </div>
          </div>

          <div className="ct-item">
            <img src={iconEmail} alt="E-mail" className="ct-icon-img" />
            <div className="ct-item-text">
              <strong>E-mail</strong>
              <span>associacaoatrpap@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Divisor vertical */}
        <div className="ct-divider" />

        {/* Direita — marca */}
        <div className="ct-marca">
          <span className="ct-marca-nome">ATRPAP</span>
          <span className="ct-marca-desc">Associação dos trabalhadores do Projeto de Assentamento Prata</span>
          <span className="ct-marca-sub">Fortalecendo da Agricultura Famliar</span>
        </div>

      </div>


      {/* ── Barra de copyright ── */}
      <div className="ct-bar">
        <span className="ct-bar-left">ATRPAP</span>
        <div className="ct-bar-center">
          <span>@ 2026 ATRPAP - Todos os direitos reservados.</span>
          <br />
          <span>CNPJ: 05.279.352/0001-41</span>
        </div>
        <div className="ct-bar-right">
          <span>Desenvolvido por</span>
          <br />
          <strong>Exception Jr</strong>
        </div>
      </div>

    </footer>
  );
}
