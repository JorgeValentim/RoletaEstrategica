import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Sobre from "./pages/Sobre";
import Martingale from "./pages/Martingale";
import Fibonacci from "./pages/Fibonacci";
import DAlembert from "./pages/DAlembert";
import logo from "./assets/logo-ajust.png";
import "./App.css";

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

  const handleStart = () => {
    if (!bank || !goal || !lossLimit || !strategy || !percentage) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    setInitialBank(bank);
    setStarted(true);
    setFinished(false);
    setFibIndex(0);
    const initialUnit = Number(((bank * percentage) / 100).toFixed(2));
    setBet(initialUnit);
  };

  const handleResult = (result) => {
    if (finished) return;

    let newBank = bank;
    if (result === "win") {
      newBank += bet;
    } else {
      newBank -= bet;
    }

    let nextBet = Number(((initialBank * percentage) / 100).toFixed(2));

    if (strategy === "Martingale") {
      if (result === "loss") {
        nextBet = Number((bet * 2).toFixed(2));
      }
    } else if (strategy === "Fibonacci") {
      const unit = Number(((initialBank * percentage) / 100).toFixed(2));
      if (result === "loss") {
        const nextIndex = Math.min(fibIndex + 1, fibonacciSequence.length - 1);
        setFibIndex(nextIndex);
        nextBet = unit * fibonacciSequence[nextIndex];
      } else {
        const nextIndex = Math.max(fibIndex - 2, 0);
        setFibIndex(nextIndex);
        nextBet = unit * fibonacciSequence[nextIndex];
      }
    } else if (strategy === "DAlembert") {
      if (result === "loss") {
        nextBet = Number((bet + 1).toFixed(2));
      } else {
        nextBet = Math.max(Number((bet - 1).toFixed(2)), 1);
      }
    }

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
      <h2 className="welcome">🎯 Bem-vindo à Roleta Estratégica!</h2>
      <p className="subtitle">Escolha sua estratégia, defina metas e jogue com responsabilidade.</p>

      <div className="inputs">
        <input type="number" placeholder="Valor da banca" onChange={(e) => { const value = Number(e.target.value); setBank(value); setInitialBank(value); }} />
        <input type="number" placeholder="Meta de lucro do dia" onChange={(e) => setGoal(Number(e.target.value))} />
        <input type="number" placeholder="Valor máximo de perda" onChange={(e) => setLossLimit(Number(e.target.value))} />
        <input type="number" placeholder="% da banca por aposta" onChange={(e) => setPercentage(Number(e.target.value))} />
        <select onChange={(e) => setStrategy(e.target.value)}>
          <option value="">Escolha uma estratégia</option>
          <option value="Martingale">Martingale</option>
          <option value="Fibonacci">Fibonacci</option>
          <option value="DAlembert">D'Alembert</option>
        </select>
        <button onClick={handleStart}>Iniciar Estratégia</button>
      </div>

      <p className="banca">💰 Banca Atual: R$ {bank.toFixed(2)}</p>

      {started && !finished && (
        <div className="resultado">
          <p>Próxima aposta: <strong>R$ {bet.toFixed(2)}</strong></p>
          <button onClick={() => handleResult("win")}>✅ Vitória</button>
          <button onClick={() => handleResult("loss")}>❌ Derrota</button>
        </div>
      )}

      {finished && (
        <div className="finalizado">
          <h2 style={{ color: bank >= initialBank + goal ? "green" : "red" }}>
            {bank >= initialBank + goal ? "🎉 Meta atingida!" : "🚫 Limite de perda atingido!"}
          </h2>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre nós</Link>
          <Link to="/martingale" onClick={() => setMenuOpen(false)}>Martingale</Link>
          <Link to="/fibonacci" onClick={() => setMenuOpen(false)}>Fibonacci</Link>
          <Link to="/dalembert" onClick={() => setMenuOpen(false)}>D'Alembert</Link>
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
        © 2025 Roleta Estratégica. Todos os direitos reservados.
      </footer>
    </div>
  );
}
