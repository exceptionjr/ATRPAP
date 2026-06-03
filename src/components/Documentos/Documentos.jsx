import { useMemo, useState, useEffect } from "react";
import { publicGet } from "../../api";
import "./Documentos.css";

export default function Documentos() {
  const [documentosData, setDocumentosData] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    publicGet('/documentos/')
      .then(data => setDocumentosData(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => {});
  }, []);

  const categorias = useMemo(
    () => [...new Set(documentosData.map(d => d.categoria))],
    [documentosData]
  );

  const documentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return documentosData;
    return documentosData.filter(d => d.titulo.toLowerCase().includes(termo));
  }, [busca, documentosData]);

  return (
    <section className="documentos-vitrine" id="documentos">
      <header className="documentos-header">
        <div>
          <h1>Vitrine de Documentos</h1>
          <p>Encontre e acesse os documentos por categoria rapidamente.</p>
        </div>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar documento pelo nome"
          className="documentos-busca"
          aria-label="Buscar documento"
        />
      </header>

      {documentosData.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Nenhum documento disponível no momento.
        </p>
      ) : categorias.map(categoria => {
        const itens = documentosFiltrados.filter(d => d.categoria === categoria);
        if (itens.length === 0) return null;
        return (
          <div key={categoria} className="documentos-categoria">
            <h2>{categoria}</h2>
            <ul className="documentos-grid">
              {itens.map(documento => (
                <li key={documento.id} className="documento-card">
                  <h3>{documento.titulo}</h3>
                  <p className="documento-card-categoria">{documento.categoria}</p>
                  <a
                    href={documento.arquivo}
                    target="_blank"
                    rel="noreferrer"
                    className="documento-card-link"
                  >
                    {documento.tipo === "pdf" ? "Visualizar PDF" : "Visualizar / Baixar"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
