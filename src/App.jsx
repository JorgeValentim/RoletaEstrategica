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
import AdBannerAdsterra from "./components/AdBannerAdsterra";

// bibliotecas para exportação
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(0);

  // Timer da rodada
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // ===== Tipo de aposta
  const [betGroup, setBetGroup] = useState("parity");
  const [betChoice, setBetChoice] = useState("par");

  const betGroupLabel = {
    parity: "Par × Ímpar",
    color: "Vermelho × Preto",
    range: "1–18 × 19–36",
  };
  const betOptions = {
    parity: [
      { value: "par", label: "Par" },
      { value: "impar", label: "Ímpar" },
    ],
    color: [
      { value: "vermelho", label: "Vermelho" },
      { value: "preto", label: "Preto" },
    ],
    range: [
      { value: "1-18", label: "1–18" },
      { value: "19-36", label: "19–36" },
    ],
  };
  const choiceLabel = (group, value) =>
    (betOptions[group].find((o) => o.value === value) || {}).label || "";

  // ===== Estratégia Condicional (anti-sequência)
  const [conditionalOn, setConditionalOn] = useState(true);
  const [streakThreshold, setStreakThreshold] = useState(4); // 4 ou 5
  const [streak, setStreak] = useState({ group: "parity", side: null, count: 0 });
  const [suggestedChoice, setSuggestedChoice] = useState(null);
  const [autoApplySuggestion, setAutoApplySuggestion] = useState(false);

  const oppositeMap = {
    parity: { par: "impar", impar: "par" },
    color: { vermelho: "preto", preto: "vermelho" },
    range: { "1-18": "19-36", "19-36": "1-18" },
  };
  function inferOutcomeSide(group, chosenValue, result) {
    const opp = oppositeMap[group][chosenValue];
    return result === "win" ? chosenValue : opp;
    // win  -> streak.side = betChoice
    // loss -> streak.side = opposite(betChoice)
  }

  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    const check = () => setIsCompact(window.innerWidth < 1280);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const PH = {
    bank: "Valor da banca",
    goal: "Meta diária",
    loss: "Máx. perda",
    perc: "% por aposta",
  };

  const fmt = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDuration = (ms) => {
    if (!ms || ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${ss}s`);
    return parts.join(" ");
  };

  const getUnit = (base = initialBank) =>
    Number(((base * percentage) / 100).toFixed(2));

  const resetBetChoiceForGroup = (group) => {
    const def = {
      parity: "par",
      color: "vermelho",
      range: "1-18",
    }[group];
    setBetChoice(def);
  };

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
    setHistory([]);
    setStep(0);
    setStreak({ group: betGroup, side: null, count: 0 });
    setSuggestedChoice(null);
    setStartTime(Date.now());
    setEndTime(null);
  };

  // 🔧 SUGESTÃO/APLICAÇÃO: quando o limiar é atingido, sugerir SEMPRE o oposto do que estou apostando agora
  // Isso faz o "Aplicar agora" trocar corretamente tanto após vitórias quanto após derrotas.
  useEffect(() => {
    if (!conditionalOn) return;
    if (!streak?.side || streak?.count < streakThreshold) return;

    const swapSide = oppositeMap[betGroup][betChoice]; // ← oposto da escolha atual
    if (autoApplySuggestion) {
      setBetChoice(swapSide);
      setSuggestedChoice(null);
      setStreak({ group: betGroup, side: null, count: 0 }); // evitar reaparecer logo em seguida
    } else {
      setSuggestedChoice(swapSide);
    }
  }, [streak, conditionalOn, streakThreshold, autoApplySuggestion, betGroup, betChoice]);

  const handleResult = (result) => {
    if (finished) return;

    // 1) Anti-sequência: atualiza streak com base no RESULTADO
    const outcomeSide = inferOutcomeSide(betGroup, betChoice, result);
    const nextCount =
      streak.group === betGroup && streak.side === outcomeSide
        ? streak.count + 1
        : 1;
    setStreak({ group: betGroup, side: outcomeSide, count: nextCount });

    // 2) Lógica financeira
    let newBank = bank;
    if (result === "win") newBank += bet;
    else newBank -= bet;

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
      nextBet =
        result === "loss"
          ? Number((bet + unit).toFixed(2))
          : Math.max(Number((bet - unit).toFixed(2)), unit);
    }

    nextBet = Math.max(nextBet, unit);
    setBank(Number(newBank.toFixed(2)));
    setBet(Number(nextBet.toFixed(2)));

    // 3) Histórico
    setHistory((h) => [
      {
        id: h.length + 1,
        resultado: result === "win" ? "Vitória" : "Derrota",
        aposta: Number(bet.toFixed(2)),
        bancaApos: Number(newBank.toFixed(2)),
        alvo: `${betGroupLabel[betGroup]} → ${choiceLabel(betGroup, betChoice)}`,
        horario: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
      ...h,
    ]);
    setStep((s) => s + 1);

    // 4) Meta/stop
    const profit = newBank - initialBank;
    const loss = initialBank - newBank;
    if (profit >= goal || loss >= lossLimit) {
      setFinished(true);
      setEndTime(Date.now());
    }
  };

  // ===== Exportação (PDF/JPEG)
  const reportRef = useRef(null);

  const exportReport = async (format = "pdf") => {
    const node = reportRef.current;
    if (!node) return;

    // canvas com resolução maior para qualidade
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

    if (format === "jpeg") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `relatorio-roleta-${stamp}.jpeg`;
      link.click();
      return;
    }

    // PDF (A4, portrait) — ajusta para caber em uma página
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW - 10; // margem
    const imgH = (canvas.height * imgW) / canvas.width;

    // centraliza
    const ratio = Math.min(imgW / canvas.width, (pageH - 10) / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;

    pdf.addImage(imgData, "JPEG", x, y, w, h);
    pdf.save(`relatorio-roleta-${stamp}.pdf`);
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <h1 className="hero-title">Bem-vindo a Roleta Estratégica!</h1>
          <p className="hero-subtitle">
            Escolha sua estratégia, defina metas e jogue com responsabilidade
          </p>
        </div>
      </section>

      {/* CARD DE CONTROLES */}
      <section className="control-wrap">
        <div className="control-card">
          <div className="inputs">
            <input
              type="number"
              min="0"
              placeholder={PH.bank}
              aria-label="Valor da banca"
              title="Valor da banca"
              onChange={(e) => {
                const value = Number(e.target.value);
                setBank(value);
                setInitialBank(value);
              }}
            />
            <input
              type="number"
              min="0"
              placeholder={PH.goal}
              aria-label="Meta diária"
              title="Meta diária"
              onChange={(e) => setGoal(Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              placeholder={PH.loss}
              aria-label="Máx. perda"
              title="Valor máximo de perda"
              onChange={(e) => setLossLimit(Number(e.target.value))}
            />
            <input
              type="number"
              min="1"
              max="100"
              placeholder={PH.perc}
              aria-label="% por aposta"
              title="% da banca por aposta"
              onChange={(e) => setPercentage(Number(e.target.value))}
            />

            {/* Estratégia — compacta */}
            <div className="field span2">
              <label className="field-label">Estratégia</label>
              <select
                className="select"
                onChange={(e) => setStrategy(e.target.value)}
                title="Escolha uma estratégia"
                aria-label="Escolha uma estratégia"
                defaultValue=""
              >
                <option value="" disabled>Escolha</option>
                <option value="Martingale">Martingale</option>
                <option value="Fibonacci">Fibonacci</option>
                <option value="DAlembert">D'Alembert</option>
              </select>
            </div>

            {/* Tipo de aposta + Sua escolha */}
            <div className="bet-box span2" role="group" aria-labelledby="lab-bet">
              <div className="bet-col">
                <label id="lab-bet" className="bet-label">Tipo de aposta</label>
                <div className="seg seg-group">
                  <button
                    type="button"
                    className={`seg-item ${betGroup === "parity" ? "active" : ""}`}
                    onClick={() => {
                      setBetGroup("parity");
                      resetBetChoiceForGroup("parity");
                    }}
                  >
                    Par × Ímpar
                  </button>
                  <button
                    type="button"
                    className={`seg-item ${betGroup === "color" ? "active" : ""}`}
                    onClick={() => {
                      setBetGroup("color");
                      resetBetChoiceForGroup("color");
                    }}
                  >
                    Vermelho × Preto
                  </button>
                  <button
                    type="button"
                    className={`seg-item ${betGroup === "range" ? "active" : ""}`}
                    onClick={() => {
                      setBetGroup("range");
                      resetBetChoiceForGroup("range");
                    }}
                  >
                    1–18 × 19–36
                  </button>
                </div>
              </div>

              <div className="bet-col">
                <label className="bet-label">Sua escolha</label>
                <div className="seg">
                  {betOptions[betGroup].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`seg-item ${betChoice === opt.value ? "active" : ""}`}
                      onClick={() => setBetChoice(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estratégia Condicional */}
            <div className="cond-panel span2">
              <div className="cond-head">
                <div className="cond-title">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={conditionalOn}
                      onChange={(e) => setConditionalOn(e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                  <div>
                    <div className="cond-title-text">Estratégia Condicional</div>
                    <div className="cond-sub">Anti-sequência (evita longas sequências do mesmo lado).</div>
                  </div>
                </div>
              </div>

              <div className="cond-body">
                <div className="cond-group">
                  <div className="cond-label">Limiar</div>
                  <div className="pill-row">
                    <label className={`pill ${streakThreshold === 4 ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="limiar"
                        checked={streakThreshold === 4}
                        onChange={() => setStreakThreshold(4)}
                      />
                      4 saídas iguais
                    </label>
                    <label className={`pill ${streakThreshold === 5 ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="limiar"
                        checked={streakThreshold === 5}
                        onChange={() => setStreakThreshold(5)}
                      />
                      5 saídas iguais
                    </label>
                  </div>
                </div>

                <div className="cond-group">
                  <div className="cond-label">Ação</div>
                  <label className="switch-line">
                    <input
                      type="checkbox"
                      checked={autoApplySuggestion}
                      onChange={(e) => setAutoApplySuggestion(e.target.checked)}
                    />
                    <span className="switch-fake" />
                    <span className="switch-text">Aplicar automaticamente a sugestão</span>
                  </label>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="btn-cta" onClick={handleStart}>
              <span className="btn-cta-icon">▶</span>
              Iniciar Estratégia
            </button>
          </div>

          <p className="banca">
            <span className="coin" aria-hidden>🪙</span>
            Banca Atual: <strong>R$ {bank.toFixed(2)}</strong>
          </p>
        </div>
      </section>

      {/* Caixa 2 — instruções */}
      <section className="fifty-helper">
        <div className="fh-head">
          <h3>Opções 50% — Como funciona</h3>
          <div className="fh-meta">
            Escolha <strong>uma</strong> das opções com ~50% de chance:
            <br />
            <b>Par × Ímpar</b>, <b>Vermelho × Preto</b> ou <b>1–18 × 19–36</b>.
            Depois aplique sua estratégia (Martingale, Fibonacci ou D’Alembert).
          </div>
        </div>
      </section>

      {/* Resultados / Ações */}
      <section className="sim-area">
        {started && !finished && (
          <div className="resultado">
            <p>
              Próxima aposta: <strong>R$ {bet.toFixed(2)}</strong>{" — "}
              <span title={betGroupLabel[betGroup]}>{choiceLabel(betGroup, betChoice)}</span>
            </p>

            {/* ALERTA CONDICIONAL */}
            {streak?.side && (
              <>
                <div className={`alert-box ${streak.count >= streakThreshold ? "alert-hot" : ""}`}>
                  <div className="alert-icon">🔄</div>
                  <div className="alert-text">
                    <strong>{streak.count}×</strong> seguidas em{" "}
                    <b>{choiceLabel(betGroup, streak.side)}</b>
                    {streak.count >= streakThreshold && (
                      <span className="alert-suggest">
                        ⚠️ Atenção! Considere mudar para o lado oposto (limiar: {streakThreshold}).
                      </span>
                    )}
                  </div>
                </div>

                {conditionalOn && suggestedChoice && !autoApplySuggestion && (
                  <div className="alert-action">
                    Próxima aposta sugerida:{" "}
                    <b>{choiceLabel(betGroup, suggestedChoice)}</b>
                    <button
                      className="btn-apply"
                      onClick={() => {
                        setBetChoice(suggestedChoice);
                        setSuggestedChoice(null);
                        setStreak({ group: betGroup, side: null, count: 0 }); // reset após aplicar manualmente
                      }}
                    >
                      Aplicar agora
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="result-buttons">
              <button className="btn-win" onClick={() => handleResult("win")}>Vitória</button>
              <button className="btn-lose" onClick={() => handleResult("loss")}>Derrota</button>
            </div>
          </div>
        )}

        {/* ======= RELATÓRIO + EXPORTAÇÃO ======= */}
        {started && (
          <div ref={reportRef}>
            {/* Cabeçalho do relatório (aparece também junto com o histórico) */}
            <div className="report-header">
              <div className="report-title">Relatório da rodada</div>
              <div className="report-grid">
                <div><span>Estratégia:</span> <b>{strategy || "—"}</b></div>
                <div><span>Tipo de aposta:</span> <b>{betGroupLabel[betGroup]}</b></div>
                <div><span>Jogadas:</span> <b>{step}</b></div>
                <div><span>Tempo de jogo:</span>{" "}
                  <b>{formatDuration((finished ? endTime : Date.now()) - (startTime || Date.now()))}</b>
                </div>
                <div><span>Banca inicial:</span> <b>{fmt(initialBank || 0)}</b></div>
                <div><span>Banca atual:</span> <b>{fmt(bank || 0)}</b></div>
              </div>
            </div>

            {/* Histórico */}
            <aside className="history-card" aria-live="polite">
              <div className="history-head">
                <h3>Histórico da rodada</h3>
                <span className="history-meta">
                  {step} {step === 1 ? "jogada" : "jogadas"}
                </span>
              </div>
              {history.length === 0 ? (
                <p className="history-empty">Os resultados aparecerão aqui após sua primeira jogada.</p>
              ) : (
                <ul className="history-list">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className={`history-row ${item.resultado === "Vitória" ? "ok" : "no"}`}
                    >
                      <span className="h-col h-col--time">{item.horario}</span>
                      <span className="h-col h-col--res">{item.resultado}</span>
                      <span className="h-col h-col--bet">
                        {fmt(item.aposta)} — {item.alvo}
                      </span>
                      <span className="h-col h-col--bank">{fmt(item.bancaApos)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        )}

        {/* Botões de exportação (mostra quando finaliza) */}
        {finished && (
          <div className="export-actions">
            <button className="btn-export" onClick={() => exportReport("pdf")}>
              Salvar PDF
            </button>
            <button className="btn-export outline" onClick={() => exportReport("jpeg")}>
              Salvar JPEG
            </button>
          </div>
        )}

        {finished && (
          <div className="finalizado">
            <h2 style={{ color: bank >= initialBank + goal ? "#16a34a" : "#dc2626" }}>
              {bank >= initialBank + goal ? "🎉 Meta atingida!" : "🚫 Limite de perda atingido!"}
            </h2>
          </div>
        )}
      </section>

      {/* Anúncios 
      <div className="ad ad-bottom">
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>
      */}
    </main>
  );
}

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isStrategy = ["/martingale", "/fibonacci", "/dalembert"].includes(location.pathname);

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
          <span className="logo-text">
            <span className="logo-word logo-top">Roleta</span>
            <span className="logo-word logo-bottom">Estratégica</span>
          </span>
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

      <div className="ad ad-top">
        <AdBannerAdsterra />
      </div>

      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="" className="footer-logo" aria-hidden="true" />
            <div>
              <strong>Roleta Estratégica</strong>
              <div className="footer-copy">© {new Date().getFullYear()} — Todos os direitos reservados.</div>
            </div>
          </div>

          {/* Ícones à direita (inclui e-mail) */}
          <nav className="footer-social" aria-label="Redes sociais">
            <ul className="social-list">
              {/* E-mail */}
              <li>
                <a href="mailto:contato@roletaestrategicabr.com.br" target="_blank" rel="noopener noreferrer" aria-label="E-mail">
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </li>

              {/* YouTube */}
              <li>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z" />
                  </svg>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z"/>
                  </svg>
                </a>
              </li>

              {/* Telegram */}
              <li>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                    <path d="M9.04 15.52 8.7 19.9c.61 0 .87-.26 1.19-.57l2.86-2.74 5.93 4.34c1.09.6 1.86.29 2.16-1.01l3.91-18.3c.35-1.64-.59-2.28-1.65-1.89L1.26 9.77C-.33 10.39-.31 11.23.97 11.62l5.92 1.85L19.6 5.38c.59-.38 1.13-.17.69.21L9.04 15.52z" />
                  </svg>
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
      <Shell />
    </MaybeRouter>
  );
}
