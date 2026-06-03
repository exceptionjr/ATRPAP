import { useState, useEffect, useMemo } from 'react';
import { publicGet } from '../../api';
import './Transparencia.css';

const TIPOS_FILTRO = [
  { id: 'todos',      label: 'Todos os tipos' },
  { id: 'protocolo',  label: 'Protocolos' },
  { id: 'realocacao', label: 'Realocação de Fundos' },
  { id: 'extensao',   label: 'Extensão de Prazo' },
  { id: 'aquisicao',  label: 'Aquisição Emergencial' },
];

function formatarValor(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dateStr) {
  if (!dateStr) return '';
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const [year, month, day] = dateStr.split('-');
  return `${parseInt(day)} ${meses[parseInt(month) - 1]} ${year}`;
}

export default function Transparencia() {
  const [projetos, setProjetos] = useState([]);
  const [protocolos, setProtocolos] = useState([]);
  const [excecoes, setExcecoes] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    publicGet('/projetos/').then(d => setProjetos(Array.isArray(d) ? d : (d.results ?? []))).catch(() => {});
    publicGet('/protocolos/').then(d => setProtocolos(Array.isArray(d) ? d : (d.results ?? []))).catch(() => {});
    publicGet('/excecoes/').then(d => setExcecoes(Array.isArray(d) ? d : (d.results ?? []))).catch(() => {});
  }, []);

  const protocolosFiltrados = useMemo(() => {
    if (filtroTipo !== 'todos' && filtroTipo !== 'protocolo') return [];
    const termo = busca.trim().toLowerCase();
    if (!termo) return protocolos;
    return protocolos.filter(p =>
      p.numero?.toLowerCase().includes(termo) || p.descricao?.toLowerCase().includes(termo)
    );
  }, [protocolos, busca, filtroTipo]);

  const excecoesFiltradas = useMemo(() => {
    if (filtroTipo === 'protocolo') return [];
    let items = filtroTipo !== 'todos' ? excecoes.filter(e => e.tipo === filtroTipo) : excecoes;
    const termo = busca.trim().toLowerCase();
    if (!termo) return items;
    return items.filter(e =>
      e.responsavel?.toLowerCase().includes(termo) || e.tipo_display?.toLowerCase().includes(termo)
    );
  }, [excecoes, busca, filtroTipo]);

  const showProjetos   = filtroTipo === 'todos';
  const showProtocolos = filtroTipo === 'todos' || filtroTipo === 'protocolo';
  const showExcecoes   = filtroTipo !== 'protocolo';

  return (
    <section className="compact-transparency">
      <header className="compact-header">
        <div>
          <h1>Dashboard de Transparência Agrícola</h1>
          <p>Visão rápida de execução, protocolos e alertas de desvio.</p>
        </div>
      </header>

      <div className="search-filter-section">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Pesquisar por palavra-chave..."
          className="search-input"
          aria-label="Pesquisar conteúdo"
        />
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="filter-select"
          aria-label="Filtrar por tipo"
        >
          {TIPOS_FILTRO.map(tipo => (
            <option key={tipo.id} value={tipo.id}>{tipo.label}</option>
          ))}
        </select>
      </div>

      <div className="compact-grid">
        {showProjetos && (
          <article className="compact-card summary-card">
            <div className="card-title"><span>Resumo de Execução</span></div>
            <div className="summary-values">
              {projetos.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Nenhum projeto cadastrado.
                </p>
              ) : projetos.map(p => (
                <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                  <strong style={{ display: 'block' }}>{p.nome}</strong>
                  <span style={{ fontSize: '0.85em', color: '#777' }}>{p.periodo}</span>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.9em' }}>
                    <span>Aprovado: <strong>{formatarValor(p.valor_aprovado)}</strong></span>
                    <span>Executado: <strong>{formatarValor(p.valor_executado)}</strong></span>
                    <span>Saldo: <strong>{formatarValor(p.saldo_disponivel)}</strong></span>
                  </div>
                  <span style={{
                    display: 'inline-block', marginTop: '4px', padding: '2px 8px',
                    borderRadius: '4px', fontSize: '0.8em', background: '#e8f5e9', color: '#2e7d32'
                  }}>
                    {p.status_display ?? p.status}
                  </span>
                </div>
              ))}
            </div>
          </article>
        )}

        {showProtocolos && (
          <article className="compact-card protocols-card">
            <div className="card-title"><span>Tabela de Protocolos</span></div>
            <div className="table-scroll">
              {protocolosFiltrados.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Nenhum protocolo encontrado.
                </p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5' }}>
                      <th style={thStyle}>Número</th>
                      <th style={thStyle}>Data</th>
                      <th style={thStyle}>Descrição</th>
                      <th style={thStyle}>Aprovado por</th>
                      <th style={thStyle}>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protocolosFiltrados.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={tdStyle}>{p.numero}</td>
                        <td style={tdStyle}>{formatarData(p.data)}</td>
                        <td style={tdStyle}>{p.descricao}</td>
                        <td style={tdStyle}>{p.aprovado_por}</td>
                        <td style={tdStyle}>{formatarValor(p.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </article>
        )}

        {showExcecoes && (
          <aside className="compact-card exceptions-card">
            <div className="card-title"><span>Alertas de Desvio</span></div>
            <div className="exceptions-list">
              {excecoesFiltradas.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Nenhum alerta encontrado.
                </p>
              ) : excecoesFiltradas.map(e => (
                <div key={e.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong>{e.tipo_display}</strong>
                    <span style={{ fontSize: '0.85em', color: '#777' }}>{formatarData(e.data)}</span>
                  </div>
                  <p style={{ margin: '2px 0', fontSize: '0.9em' }}>
                    <span style={{ color: '#555' }}>Responsável: </span>{e.responsavel}
                  </p>
                  <p style={{ margin: '2px 0', fontSize: '0.9em' }}>
                    <span style={{ color: '#555' }}>Valor: </span>{formatarValor(e.valor)}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.88em', color: '#444' }}>{e.justificativa}</p>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                    fontSize: '0.8em',
                    background: e.status === 'aprovada' ? '#e8f5e9' : e.status === 'reprovada' ? '#ffebee' : '#fff3e0',
                    color:      e.status === 'aprovada' ? '#2e7d32' : e.status === 'reprovada' ? '#c62828' : '#e65100',
                  }}>
                    {e.status_display}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

const thStyle = { padding: '8px 10px', textAlign: 'left', fontWeight: '600', whiteSpace: 'nowrap' };
const tdStyle = { padding: '8px 10px' };
