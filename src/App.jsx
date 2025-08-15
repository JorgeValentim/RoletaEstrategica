import React, { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  BrowserRouter,
  useInRouterContext,
} from "react-router-dom";
import Sobre from "./pages/Sobre";
import Martingale from "./pages/Martingale";
import Fibonacci from "./pages/Fibonacci";
import DAlembert from "./pages/DAlembert";
import logo from "./assets/logo-ajust.png";
import "./App.css";

/** =========================================================
 *  SEO helper (SPA-friendly)
 *  - Atualiza <title> e <meta name="description"> por rota
 * ========================================================= */
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

/** =========================================================
 *  Hook: fecha o menu ao clicar fora e com tecla ESC
 * ========================================================= */
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

/** =========================================================
 *  Página Inicial (simulador)
 *  - Não encerra após 1 vitória; encerra somente ao atingir meta
 *    de lucro OU limite de perda (como já esperado)
 *  - Corrige D’Alembert para usar a mesma "unidade" (percentual)
 *    e não 1 fixo
 *  - Validações de entrada e limites
 * ========================================================= */
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

  // SEO por página
  SEO({ title: "Roleta Estratégica — Simulador" });

  const getUnit = (base = initialBank) =>
    Number(((base * percentage) / 100).toFixed(2));

  const handleStart = () => {
    if (
      !bank ||
      bank <= 0 ||
      !goal ||
      goal <= 0 ||
      !lossLimit ||
      lossLimit <= 0 ||
      !strategy ||
      !percentage ||
      percentage <= 0 ||
      percentage > 100
    ) {
      alert(
        "Preencha todos os campos corretamente.\n• Banca, meta e perda > 0\n• % da banca (1 a 100)\n• Escolha uma estratégia."
      );
      return;
    }
    setInitialBank(bank);
    setStarted(true);
    setFinished(false);
    setFibIndex(0);
    setBet(getUnit(bank));
  };

  const handleResult = (result) => {
    if (finished) return;

    let newBank = bank;
    if (result === "win") {
      newBank += bet;
    } else {
      newBank -= bet;
    }

    // Unidade base da aposta em % da banca inicial
    const unit = getUnit();

    let nextBet = unit;

    if (strategy === "Martingale") {
      if (result === "loss") nextBet = Number((bet * 2).toFixed(2));
      else nextBet = unit; // após vitória, volta ao valor base
    } else if (strategy === "Fibonacci") {
      if (result === "loss") {
        const nextIndex = Math.min(fibIndex + 1, fibonacciSequence.length - 1);
        setFibIndex(nextIndex);
        nextBet = Number((unit * fibonacciSequence[nextIndex]).toFixed(2));
      } else {
        // vitória: recua 2 casas (ou ao início)
        const nextIndex = Math.max(fibIndex - 2, 0);
        setFibIndex(nextIndex);
        nextBet = Number((unit * fibonacciSequence[nextIndex]).toFixed(2));
      }
    } else if (strategy === "DAlembert") {
      // Ajuste: passo = "unit" (não 1 fixo)
      if (result === "loss") {
        nextBet = Number((bet + unit).toFixed(2));
      } else {
        nextBet = Math.max(Number((bet - unit).toFixed(2)), unit);
      }
    }

    // Sanitiza: aposta mínima é a unit; não pode ser 0
    nextBet = Math.max(nextBet, unit);

    setBank(Number(newBank.toFixed(2)));
    setBet(Number(nextBet.toFixed(2)));

    const profit = newBank - initialBank;
    const loss = initialBank - newBank;

    if (profit >= goal || loss >= lossLimit) {
      setFinished(true);
    }
  };

  return (
    <main className="main">
      <h1 className="welcome">🎯 Bem-vindo à Roleta Estratégica!</h1>
      
<p className="subtitle">
        Escolha sua estratégia, defina metas e jogue com responsabilidade.
      </p>

      {/* Google AdSense banner_home_top */}
      <div style={{ maxWidth: "100%", margin: "20px auto", textAlign: "center" }}>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8691122863343072"
            crossOrigin="anonymous"></script>
        <ins className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8691122863343072"
            data-ad-slot="8827435481"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
      </div>


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
        <button onClick={handleStart}>Iniciar Estratégia</button>
      </div>

      <p className="banca">
        💰 Banca Atual: <strong>R$ {bank.toFixed(2)}</strong>
      </p>

      {started && !finished && (
        <div className="resultado">
          <p>
            Próxima aposta: <strong>R$ {bet.toFixed(2)}</strong>
          </p>
          <button onClick={() => handleResult("win")}>✅ Vitória</button>
          <button onClick={() => handleResult("loss")}>❌ Derrota</button>
        </div>
      )}

      {finished && (
        <div className="finalizado">
          <h2
            style={{
              color: bank >= initialBank + goal ? "green" : "red",
            }}
          >
            {bank >= initialBank + goal
              ? "🎉 Meta atingida!"
              : "🚫 Limite de perda atingido!"}
          </h2>
        </div>
      )}
    </main>
  );
}

/** =========================================================
 *  App (Layout + Navegação)
 *  - Melhoria do menu/mobile (acessível, fecha fora/ESC)
 *  - Logo:
 *      • Se estiver na home ("/"): força reload da página
 *      • Se estiver em outra rota: navega para "/"
 *  - SEO por rota via efeito em <App/>
 *  - Compatível com projetos que já envolvem um Router externo
 *    (evita "Router dentro de Router")
 * ========================================================= */
function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useDismissible(() => setMenuOpen(false));
  const navigate = useNavigate();
  const location = useLocation();

  // SEO dinâmico por rota
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
    if (location.pathname === "/") {
      // Atualiza a página atual
      window.location.reload();
    } else {
      // Volta para a página inicial
      navigate("/");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <button
          className="logo-btn"
          onClick={onLogoClick}
          aria-label="Ir para a página inicial"
          title="Roleta Estratégica"
          style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
        >
          <img src={logo} alt="Roleta Estratégica — logo" className="logo" />
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
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Início
          </NavLink>
          <NavLink to="/sobre" onClick={() => setMenuOpen(false)}>
            Sobre nós
          </NavLink>
          <NavLink to="/martingale" onClick={() => setMenuOpen(false)}>
            Martingale
          </NavLink>
          <NavLink to="/fibonacci" onClick={() => setMenuOpen(false)}>
            Fibonacci
          </NavLink>
          <NavLink to="/dalembert" onClick={() => setMenuOpen(false)}>
            D'Alembert
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/martingale" element={<Martingale />} />
        <Route path="/fibonacci" element={<Fibonacci />} />
        <Route path="/dalembert" element={<DAlembert />} />
      </Routes>

      <footer className="footer">
        © {new Date().getFullYear()} Roleta Estratégica. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}

// Componente utilitário: envolve com BrowserRouter apenas se necessário
function MaybeRouter({ children }) {
  return useInRouterContext() ? (
    <>{children}</>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );
}

export default function App() {
  return (
    <MaybeRouter>
      <Shell />
    </MaybeRouter>
  );
}