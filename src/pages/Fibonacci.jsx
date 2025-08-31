
import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function Fibonacci() {
  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <span className="badge">Estratégias</span>
            <h1>Estratégia Fibonacci</h1>
            <p className="lead">
              Baseada na sequência matemática 1, 1, 2, 3, 5, 8, 13… A cada perda você avança na sequência;
              ao vencer, retorna duas posições.
            </p>
          </div>
          {/* imagem com moldura de vidro */}
          <div className="hero-figure-frame">
            <img className="page-hero-figure" src={RoletaImg2} alt="Roleta — Estratégia Fibonacci" />
          </div>
        </div>
      </section>

      {/* 
      <div className="page-ads-top"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
      */}
      {/* CONTEÚDO */}
      <div className="page-wrap">
        <h2 className="section-title">Como funciona</h2>
        <p>
          Defina uma <strong>unidade base</strong> de aposta. Após uma derrota, aumente o valor conforme o próximo número da sequência.
          Ao ganhar, retorne duas casas, reduzindo a aposta.
        </p>

        <div className="content-grid" style={{marginTop: 12}}>
          <div>
            <h3 className="section-title" style={{fontSize:22, marginTop:6}}>Exemplo prático</h3>
            <p>Unidade base de R$ 10:</p>
            <ul>
              <li>1ª aposta: R$ 10 (1) → <strong>Perdeu</strong></li>
              <li>2ª aposta: R$ 10 (1) → <strong>Perdeu</strong></li>
              <li>3ª aposta: R$ 20 (2) → <strong>Perdeu</strong></li>
              <li>4ª aposta: R$ 30 (3) → <strong>Ganhou</strong></li>
              <li>Próxima aposta volta para R$ 10 (1).</li>
            </ul>
            <p>O objetivo é recuperar perdas gradualmente, controlando a banca.</p>
          </div>
          <img src={RoletaImg2} alt="Exemplo Fibonacci em roleta" />
        </div>

        <div className="k-cards">
          <div className="k-card">
            <h3>✅ Pontos positivos</h3>
            <ul>
              <li>Apostas sobem de forma mais moderada que na Martingale.</li>
              <li>Melhor controle de risco em sequências longas.</li>
              <li>Boa para manter disciplina.</li>
            </ul>
          </div>
          <div className="k-card">
            <h3>⚠️ Pontos de atenção</h3>
            <ul>
              <li>A recuperação pode demorar mais.</li>
              <li>Se a sequência de perdas for muito longa, ainda exige boa banca.</li>
              <li>Requer foco para acompanhar a progressão.</li>
            </ul>
          </div>
        </div>

        <div className="callout">
          <strong>Jogue com responsabilidade:</strong> a Fibonacci auxilia no controle, mas não garante lucros.
        </div>
        {/*
        <div className="page-ads-bottom"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
        */}
        </div>
    </div>
  );
}
