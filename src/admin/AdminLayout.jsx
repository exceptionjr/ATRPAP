import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from './api';
import './AdminLayout.css';

const NAV = [
  { to: '/gestao/noticias',   label: '📰 Notícias' },
  { to: '/gestao/galeria',    label: '🖼️ Galeria' },
  { to: '/gestao/documentos', label: '📄 Documentos' },
  { to: '/gestao/projetos',   label: '📊 Projetos' },
  { to: '/gestao/linhas',     label: '↳ Linhas Orçamentárias' },
  { to: '/gestao/protocolos', label: '📋 Protocolos' },
  { to: '/gestao/excecoes',   label: '⚠️ Exceções' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/gestao/login');
  };

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          ATRPAP
          <span>Gestão de Conteúdo</span>
        </div>
        <nav>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          Sair da conta
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
