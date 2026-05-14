import { useMemo, useState } from "react";
import "./Documentos.css";


const documentosData = [];

export default function Documentos() {
    const [busca, setBusca] = useState("");

    const categorias = useMemo(
        () => [...new Set(documentosData.map((documento) => documento.categoria))],
        []
    );

    const documentosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return documentosData;

        return documentosData.filter((documento) =>
            documento.titulo.toLowerCase().includes(termo)
        );
    }, [busca]);

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
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Buscar documento pelo nome"
                    className="documentos-busca"
                    aria-label="Buscar documento"
                />
            </header>

            {categorias.map((categoria) => {
                const itensCategoria = documentosFiltrados.filter(
                    (documento) => documento.categoria === categoria
                );

                if (itensCategoria.length === 0) return null;

                return (
                    <div key={categoria} className="documentos-categoria">
                        <h2>{categoria}</h2>
                        <ul className="documentos-grid">
                            {itensCategoria.map((documento) => (
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