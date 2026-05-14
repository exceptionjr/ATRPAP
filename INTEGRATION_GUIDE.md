# 🚀 Guia de Integração - Portal de Transparência

## ⚡ Quick Start

O componente está pronto para uso! Escolha uma das opções abaixo:

---

## Opção 1: Integração com React Router (Recomendado)

### 1.1 Instale React Router (se ainda não tiver)
```bash
npm install react-router-dom
```

### 1.2 Atualize seu `src/App.jsx`

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Gallery from './components/Gallery/Gallery';
import QuemSomos from './components/QuemSomos/QuemSomos';
import OQueFazemos from './components/OQueFazemos/OQueFazemos';
import Noticias from './components/Noticias/Noticias';
import FaleConosco from './components/FaleConosco/FaleConosco';
import Contatos from './components/Contatos/Contatos';
import BackToTop from './components/BackToTop/BackToTop';
import Transparencia from './components/Trasparencia/Transparencia';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <Gallery />
            <QuemSomos />
            <OQueFazemos />
            <Noticias />
            <FaleConosco />
          </main>
        } />
        <Route path="/transparencia" element={<Transparencia />} />
      </Routes>
      <Contatos />
      <BackToTop />
    </Router>
  );
}

export default App;
```

### 1.3 Atualize seu `src/components/Navbar/Navbar.jsx`

Adicione este link no seu menu de navegação:

```jsx
<a href="/transparencia" className="nav-link">
  Portal de Transparência
</a>
```

---

## Opção 2: Adicionar como Seção na Landing Page

Se preferir manter tudo em uma única página:

```jsx
import Transparencia from './components/Trasparencia/Transparencia';

function App() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <QuemSomos />
        <OQueFazemos />
        <Transparencia />  {/* ← Adicione aqui */}
        <Noticias />
        <FaleConosco />
      </main>
      <Contatos />
      <BackToTop />
    </div>
  );
}

export default App;
```

---

## Opção 3: Modal/Popup (Para Integração Mínima)

```jsx
import { useState } from 'react';
import Transparencia from './components/Trasparencia/Transparencia';

function App() {
  const [showTransparencia, setShowTransparencia] = useState(false);

  return (
    <>
      <button onClick={() => setShowTransparencia(true)}>
        Ver Portal de Transparência
      </button>
      
      {showTransparencia && (
        <div className="modal">
          <Transparencia />
          <button onClick={() => setShowTransparencia(false)}>Fechar</button>
        </div>
      )}
    </>
  );
}

export default App;
```

---

## ✨ Funcionalidades Imediatamente Disponíveis

✅ **Dashboard de Orçamento**
- Estatísticas do projeto
- Barras de progresso
- Tabela com linhas de despesa
- Status visual (Concluído, Em Andamento, Planejado)

✅ **Timeline de Protocolos**
- Histórico de aprovações cronológico
- Responsáveis por aprovação
- Valores aprovados
- Clicável para relacionar com despesas

✅ **Quadro de Exceções**
- Realocações de fundos
- Extensões de prazo
- Aquisições emergenciais
- Status de aprovação

✅ **Filtros Funcionais**
- Filtro por Período (2022-2024)
- Filtro por Protocolo
- Filtro por Status
- Busca em tempo real

✅ **Design Responsivo**
- Otimizado para desktop, tablet e mobile
- Tabelas adaptáveis
- Paleta agrícola profissional

---

## 🔌 Conectar com Backend Real

### Exemplo com Fetch API

```jsx
import { useEffect, useState } from 'react';

export default function Transparencia() {
  const [projects, setProjects] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projetos').then(res => res.json()),
      fetch('/api/protocolos').then(res => res.json()),
      fetch('/api/excecoes').then(res => res.json())
    ]).then(([proj, prot, exc]) => {
      setProjects(proj);
      setProtocols(prot);
      setExceptions(exc);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando...</div>;

  // ... resto do componente
}
```

### Endpoints Esperados

```
GET  /api/projetos       → Array de projetos
GET  /api/protocolos     → Array de protocolos
GET  /api/excecoes       → Array de exceções
POST /api/relatorio      → Gera PDF para download
```

---

## 📊 Estrutura Esperada do Backend

### Projeto
```json
{
  "id": 1,
  "name": "Projeto de Irrigação Sustentável",
  "period": "2024 - Q1 a Q2",
  "approvedValue": 150000,
  "executedValue": 87500,
  "availableBalance": 62500,
  "budgetLines": [...]
}
```

### Protocolo
```json
{
  "id": 1,
  "number": "PROT-2024-001",
  "date": "2024-01-15",
  "description": "Aprovação de...",
  "approvedBy": "Nome do Responsável",
  "amount": 75000
}
```

### Exceção
```json
{
  "id": 1,
  "date": "2024-02-20",
  "type": "Realocação de Fundos",
  "value": 5000,
  "responsible": "Eng. Carlos Silva",
  "justification": "Descrição detalhada...",
  "status": "Aprovada",
  "analyzedBy": "Analista"
}
```

---

## 🎯 Próximas Etapas Recomendadas

1. **Testar a visualização:** 
   ```bash
   npm run dev
   ```

2. **Criar as rotas no seu backend** para servir dados reais

3. **Implementar autenticação** (se necessário)

4. **Adicionar funcionalidade de download** de relatórios

5. **Configurar auditoria** e logs de acesso

---

## 🆘 Troubleshooting

### Problema: Componente não aparece
**Solução:** Verifique se o arquivo está em `src/components/Trasparencia/Transparencia.jsx` (note a pasta com "T" maiúscula)

### Problema: Ícones não aparecem
**Solução:** Certifique-se de que o Lucide React está instalado:
```bash
npm install lucide-react
```

### Problema: Estilos não aplicam
**Solução:** Verifique se o arquivo CSS está no mesmo diretório:
- `Transparencia.jsx` ✓
- `Transparencia.css` ✓
- O import está correto: `import './Transparencia.css'`

### Problema: Dados aparecem, mas filtros não funcionam
**Solução:** Verifique se há console errors. Os filtros são locais (mock data) - quando integrar com backend real, atualize a lógica de filtragem.

---

## 📞 Suporte

Para dúvidas ou sugestões de melhorias:
- Abra uma issue no repositório
- Contate: transparencia@atrpap.org.br

---

**Parabéns! 🎉 Seu Portal de Transparência está pronto para usar!**
