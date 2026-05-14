import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/ATRPAP.svg';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navbarClass = isHome
    ? `navbar ${isScrolled ? 'nav-green' : 'nav-transparent'} nav-fixed ${isVisible ? 'nav-visible' : 'nav-hidden'}`
    : `navbar nav-green nav-compact nav-fixed ${isVisible ? 'nav-visible' : 'nav-hidden'}`;

  return (
    <header 
      className={navbarClass}
      onMouseEnter={() => setIsVisible(true)}
    >
      <div className={`nav-container ${isHome ? 'nav-home' : ''}`}>
        {!isHome && (
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="ATRPAP Logo" />
            </Link>
          </div>
        )}
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="/#quem-somos" onClick={() => setIsOpen(false)}>Quem somos?</a></li>
            <li><a href="/#o-que-fazemos" onClick={() => setIsOpen(false)}>O que fazemos?</a></li>
            <li><a href="/#noticias" onClick={() => setIsOpen(false)}>Notícias</a></li>
            <li><Link to="/transparencia" onClick={() => setIsOpen(false)}>Transparência</Link></li>
            <li><Link to="/documentos" onClick={() => setIsOpen(false)}>Documentos</Link></li>
            <li><a href="/#contatos" onClick={() => setIsOpen(false)}>Contatos</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
