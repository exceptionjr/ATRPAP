import { useState } from 'react';
import './Transparencia.css';

const tiposProcesso = [
  { id: 'todos', label: 'Todos os tipos' },
  { id: 'protocolo', label: 'Protocolos' },
  { id: 'infraestrutura', label: 'Infraestrutura' },
  { id: 'saude-solo', label: 'Saúde do Solo' },
  { id: 'mao-obra', label: 'Mão de Obra' },
  { id: 'execucao', label: 'Execução' },
];

export default function Transparencia() {
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

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
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar por palavra-chave..."
          className="search-input"
          aria-label="Pesquisar conteúdo"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="filter-select"
          aria-label="Filtrar por tipo de processo"
        >
          {tiposProcesso.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div className="compact-grid">
        <article className="compact-card summary-card">
          <div className="card-title">
            <span>Resumo de Execução</span>
          </div>
          <div className="summary-values">
            <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Não temos conteúdo nessa seção ainda
            </p>
          </div>
        </article>

        <article className="compact-card protocols-card">
          <div className="card-title">
            <span>Tabela de Protocolos</span>
          </div>
          <div className="table-scroll">
            <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Não temos conteúdo nessa seção ainda
            </p>
          </div>
        </article>

        <aside className="compact-card exceptions-card">
          <div className="card-title">
            <span>Alertas de Desvio</span>
          </div>
          <div className="exceptions-list">
            <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Não temos conteúdo nessa seção ainda
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
