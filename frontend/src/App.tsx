import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SkillManagement } from './components/SkillManagement';
import { SwapMatching } from './components/SwapMatching';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { TestCenter } from './components/TestCenter';
import { Profile } from './components/Profile';
import { Sessions } from './components/Sessions';
import './App.css';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <Link to="/" className={`nav-button ${isActive('/') ? 'active' : ''}`}>
        <span>🏠</span> Home
      </Link>
      <Link to="/matching" className={`nav-button ${isActive('/matching') ? 'active' : ''}`}>
        <span>🎯</span> Matching
      </Link>
      <Link to="/skills" className={`nav-button ${isActive('/skills') ? 'active' : ''}`}>
        <span>⚡</span> Skills
      </Link>
      <Link to="/tests" className={`nav-button ${isActive('/tests') ? 'active' : ''}`}>
        <span>📝</span> Tests
      </Link>
      <Link to="/sessions" className={`nav-button ${isActive('/sessions') ? 'active' : ''}`}>
        <span>📅</span> Sessions
      </Link>
      <Link to="/profile" className={`nav-button ${isActive('/profile') ? 'active' : ''}`}>
        <span>👤</span> Profile
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container header-content">
            <h1>⚡ SkillSwap</h1>
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
            </div>
          </div>
        </header>

        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Master Skills.<br />
              <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Teach Yours.</span>
            </h1>
            <p className="hero-subtitle">
              The world's first bidirectional learning network. Validated skills, perfect matches, and meaningful connections.
            </p>

            <Navigation />
          </div>
        </section>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<SwapMatching />} />
              <Route path="/matching" element={<SwapMatching />} />
              <Route path="/skills" element={<SkillManagement />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tests" element={<TestCenter />} />
              <Route path="/sessions" element={<Sessions />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>© 2026 SkillSwap Platform. Built for Advanced Peer-to-Peer Learning.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
