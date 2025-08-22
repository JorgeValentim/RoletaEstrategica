
import React, { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
  BrowserRouter,
  useInRouterContext,
} from "react-router-dom";
import Sobre from "./pages/Sobre";
import Martingale from "./pages/Martingale";
import Fibonacci from "./pages/Fibonacci";
import DAlembert from "./pages/DAlembert";
import logo from "./assets/icon.png";
import "./App.css";
import AdBanner from "./components/AdBanner";

const DEFAULT_DESC =
  "Simule estratégias de roleta (Martingale, Fibonacci e D’Alembert), configure banca, objetivos e jogue com responsabilidade.";

function SEO({ title, description = DEFAULT_DESC }) {
  useEffect(() => {
    if (title) document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function useDismissible(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
  return ref;
}

function Home() {
  const [bank, setBank] = useState(0);
  const [initialBank, setInitialBank] = useState(0);
  const [goal, setGoal] = useState(0);
  const [lossLimit, setLossLimit] = useState(0);
  const [strategy, setStrategy] = useState("");
  const [percentage, setPercentage] = useState(1);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bet, setBet] = useState(0);
  const fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  const [fibIndex, setFibIndex] = useState(0);
  const [history, setHistory] = useState([]); // histórico da rodada
  const [step, setStep] = useState(0);

  SEO({ title: "Roleta Estratégica — Simulador" });

  const fmt = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getUnit = (base = initialBank) =>
    Number(((base * percentage) / 100).toFixed(2));

  const handleStart = () => {
    if (
      !bank || bank <= 0 ||
      !goal || goal <= 0 ||
      !lossLimit || lossLimit <= 0 ||
      !strategy || !percentage || percentage <= 0 || percentage > 100
    ) {
      alert(
        "Preencha todos os campos corretamente.\\n• Banca, meta e perda > 0\\n• % da banca (1 a 100)\\n• Escolha uma estratégia."
      );
      return;
    }
    setInitialBank(bank);
    setStarted(true);
    setFinished(false);
    setFibIndex(0);
    setBet(getUnit(bank));
    setHistory([]);
    setStep(0);
  };

  const handleResult = (result) => {
    if (finished) return;

    let newBank = bank;
    if (result === "win") newBank += bet; else newBank -= bet;

    const unit = getUnit();
    let nextBet = unit;

    if (strategy === "Martingale") {
      nextBet = result === "loss" ? Number((bet * 2).toFixed(2)) : unit;
    } else if (strategy === "Fibonacci") {
      if (result === "loss") {
        const nextIndex = Math.min(fibIndex + 1, fibonacciSequence.length - 1);
        setFibIndex(nextIndex);
        nextBet = Number((unit * fibonacciSequence[nextIndex]).toFixed(2));
      } else {
        const nextIndex = Math.max(fibIndex - 2, 0);
        setFibIndex(nextIndex);
        nextBet = Number((unit * fibonacciSequence[nextIndex]).toFixed(2));
      }
    } else if (strategy === "DAlembert") {
      nextBet = result === "loss"
        ? Number((bet + unit).toFixed(2))
        : Math.max(Number((bet - unit).toFixed(2)), unit);
    }

    nextBet = Math.max(nextBet, unit);
    setBank(Number(newBank.toFixed(2)));
    setBet(Number(nextBet.toFixed(2)));

    // registra histórico desta jogada
    setHistory((h) => [
      {
        id: h.length + 1,
        resultado: result === "win" ? "Vitória" : "Derrota",
        aposta: Number(bet.toFixed(2)),
        bancaApos: Number(newBank.toFixed(2)),
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...h
    ]);
    setStep((s) => s + 1);

    const profit = newBank - initialBank;
    const loss = initialBank - newBank;
    if (profit >= goal || loss >= lossLimit) setFinished(true);
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <h1 className="hero-title">Bem-vindo a Roleta Estratégica!</h1>
          <p className="hero-subtitle">Escolha sua estratégia, defina metas e jogue com responsabilidade</p>
        </div>
      </section>

      {/* CARD DE CONTROLES */}
      <section className="control-wrap">
        <div className="control-card">
          <div className="inputs">
            <input
              type="number"
              min="0"
              placeholder="Valor da banca"
              onChange={(e) => {
                const value = Number(e.target.value);
                setBank(value);
                setInitialBank(value);
              }}
            />
            <input
              type="number"
              min="0"
              placeholder="Meta de lucro do dia"
              onChange={(e) => setGoal(Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              placeholder="Valor máximo de perda"
              onChange={(e) => setLossLimit(Number(e.target.value))}
            />
            <input
              type="number"
              min="1"
              max="100"
              placeholder="% da banca por aposta"
              onChange={(e) => setPercentage(Number(e.target.value))}
            />
            <select onChange={(e) => setStrategy(e.target.value)}>
              <option value="">Escolha uma estratégia</option>
              <option value="Martingale">Martingale</option>
              <option value="Fibonacci">Fibonacci</option>
              <option value="DAlembert">D'Alembert</option>
            </select>
            <button className="btn-primary" onClick={handleStart}>Iniciar Estratégia</button>
          </div>

          <p className="banca">
            <span className="coin" aria-hidden>🪙</span>
            Banca Atual: <strong>R$ {bank.toFixed(2)}</strong>
          </p>
        </div>
      </section>

      {/* Resultados / Ações */}
      <section className="sim-area">
        {started && !finished && (
          <div className="resultado">
            <p>
              Próxima aposta: <strong>R$ {bet.toFixed(2)}</strong>
            </p>
            <div className="result-buttons">
              <button className="btn-win" onClick={() => handleResult("win")}>Vitória</button>
              <button className="btn-lose" onClick={() => handleResult("loss")}>Derrota</button>
            </div>
          </div>
        )}

        {finished && (
          <div className="finalizado">
            <h2 style={{ color: bank >= initialBank + goal ? "#16a34a" : "#dc2626" }}>
              {bank >= initialBank + goal ? "🎉 Meta atingida!" : "🚫 Limite de perda atingido!"}
            </h2>
          </div>
        )}

        {started && (
          <aside className="history-card" aria-live="polite">
            <div className="history-head">
              <h3>Histórico da rodada</h3>
              <span className="history-meta">{step} {step === 1 ? 'jogada' : 'jogadas'}</span>
            </div>
            {history.length === 0 ? (
              <p className="history-empty">Os resultados aparecerão aqui após sua primeira jogada.</p>
            ) : (
              <ul className="history-list">
                {history.map((item) => (
                  <li key={item.id} className={`history-row ${item.resultado === 'Vitória' ? 'ok' : 'no'}`}>
                    <span className="h-col h-col--time">{item.horario}</span>
                    <span className="h-col h-col--res">{item.resultado}</span>
                    <span className="h-col h-col--bet">{fmt(item.aposta)}</span>
                    <span className="h-col h-col--bank">{fmt(item.bancaApos)}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </section>

      {/* Anúncios: topo e rodapé da Home */}
      <div className="ad ad-top">
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>
      <div className="ad ad-bottom">
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>
    </main>
  );
}

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isStrategy = ["/martingale","/fibonacci","/dalembert"].includes(location.pathname);

  const navRef = useDismissible(() => {
    setMenuOpen(false);
    setSubOpen(false);
  });

  useEffect(() => {
    const map = {
      "/": "Roleta Estratégica — Simulador",
      "/sobre": "Sobre nós — Roleta Estratégica",
      "/martingale": "Estratégia Martingale — Roleta Estratégica",
      "/fibonacci": "Estratégia Fibonacci — Roleta Estratégica",
      "/dalembert": "Estratégia D’Alembert — Roleta Estratégica",
    };
    const title = map[location.pathname] || "Roleta Estratégica";
    document.title = title;
  }, [location.pathname]);

  const onLogoClick = () => {
    if (location.pathname === "/") window.location.reload();
    else navigate("/");
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setSubOpen(false);
  };

  return (
    <div className="app">
      <header className="header">
        <button className="logo-btn" onClick={onLogoClick} aria-label="Ir para a página inicial" title="Roleta Estratégica">
          <img src={logo} alt="Roleta Estratégica — logo" className="logo" />
          <span className="logo-text"><span className="logo-word logo-top">Roleta</span><span className="logo-word logo-bottom">Estratégica</span></span>
        </button>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <nav
          id="primary-navigation"
          className={`menu ${menuOpen ? "open" : ""}`}
          ref={navRef}
          role="navigation"
          aria-label="Principal"
        >
          <NavLink to="/" onClick={closeMenus}>Início</NavLink>
          <NavLink to="/sobre" onClick={closeMenus}>Sobre nós</NavLink>

          {/* Submenu: no desktop abre por :hover/:focus-within; no mobile abre por clique (classe .open) */}
          <div className={`submenu ${subOpen ? "open" : ""}`}>
            <button
              className={`submenu-toggle ${isStrategy ? "active" : ""}`}
              aria-haspopup="true"
              aria-expanded={subOpen}
              onClick={() => setSubOpen((v) => !v)}
            >
              Estratégias ▾
            </button>
            <div className="submenu-items" role="menu">
              <NavLink to="/martingale" onClick={closeMenus} role="menuitem">Martingale</NavLink>
              <NavLink to="/fibonacci" onClick={closeMenus} role="menuitem">Fibonacci</NavLink>
              <NavLink to="/dalembert" onClick={closeMenus} role="menuitem">D'Alembert</NavLink>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/martingale" element={<Martingale />} />
        <Route path="/fibonacci" element={<Fibonacci />} />
        <Route path="/dalembert" element={<DAlembert />} />
      </Routes>

      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="" className="footer-logo" aria-hidden="true" />
            <div>
              <strong>Roleta Estratégica</strong>
              <div className="footer-copy">© {new Date().getFullYear()} — Todos os direitos reservados.</div>
            </div>
          </div>

          <div className="footer-contact">
            <span>Contato:</span>
            <a href="mailto:contato@roletaestrategicabr.com.br" className="footer-mail" rel="noopener">contato@roletaestrategicabr.com.br</a>
          </div>

          <nav className="footer-social" aria-label="Redes sociais">
            <ul className="social-list">
              <li>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  {/* YouTube */}
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  {/* Instagram */}
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.5 0-4.7-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 2.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4zm0 1.8a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm5.7-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  {/* Telegram */}
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M9.04 15.52 8.7 19.9c.61 0 .87-.26 1.19-.57l2.86-2.74 5.93 4.34c1.09.6 1.86.29 2.16-1.01l3.91-18.3c.35-1.64-.59-2.28-1.65-1.89L1.26 9.77C-.33 10.39-.31 11.23.97 11.62l5.92 1.85L19.6 5.38c.59-.38 1.13-.17.69.21L9.04 15.52z"/></svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function MaybeRouter({ children }) {
  return useInRouterContext() ? <>{children}</> : <BrowserRouter>{children}</BrowserRouter>;
}

export default function App() {
  return (
    <MaybeRouter>
      <SEO title="Roleta Estratégica — Simulador" />
      <Shell />
    </MaybeRouter>
  );
}
