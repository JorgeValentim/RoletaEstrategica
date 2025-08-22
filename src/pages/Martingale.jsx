
import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function Martingale() {
  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <span className="badge">Estratégias</span>
            <h1>Estratégia Martingale</h1>
            <p className="lead">
              Uma das estratégias de apostas mais populares na roleta para buscar recuperar perdas e obter lucro. 
              Funciona dobrando a aposta após cada perda.
            </p>
          </div>
          {/* imagem com moldura de vidro */}
          <div className="hero-figure-frame">
            <img className="page-hero-figure" src={RoletaImg2} alt="Roleta — Estratégia Martingale" />
          </div>
        </div>
      </section>

      <div className="page-ads-top"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>

      {/* CONTEÚDO */}
      <div className="page-wrap">
        <h2 className="section-title">A Estratégia Martingale</h2>
        <p>
          A <strong>Martingale</strong> é simples: após cada derrota você dobra a aposta. Ao vencer, recupera todas as perdas
          anteriores e ainda ganha uma unidade de lucro.
        </p>

        <div className="content-grid" style={{marginTop: 12}}>
          <div>
            <h3 className="section-title" style={{fontSize:22, marginTop:6}}>Exemplo prático</h3>
            <p>Suponha aposta inicial de R$ 10:</p>
            <ul>
              <li>1ª aposta: R$ 10 → <strong>Perdeu</strong></li>
              <li>2ª aposta: R$ 20 → <strong>Perdeu</strong></li>
              <li>3ª aposta: R$ 40 → <strong>Perdeu</strong></li>
              <li>4ª aposta: R$ 80 → <strong>Ganhou</strong></li>
            </ul>
            <p>Ao ganhar na 4ª rodada, você recupera R$ 70 em perdas e lucra R$ 10.</p>
          </div>
          <img src={RoletaImg2} alt="Exemplo Martingale em roleta" />
        </div>

        <div className="k-cards">
          <div className="k-card">
            <h3>✅ Pontos positivos</h3>
            <ul>
              <li>Recuperação rápida de perdas.</li>
              <li>Fácil de entender e aplicar.</li>
              <li>Funciona bem em apostas 50/50 (vermelho/preto).</li>
            </ul>
          </div>
          <div className="k-card">
            <h3>⚠️ Pontos de atenção</h3>
            <ul>
              <li>Exige banca alta para sequências longas de perdas.</li>
              <li>Limites da mesa podem impedir a recuperação.</li>
              <li>Risco elevado de perdas grandes.</li>
            </ul>
          </div>
        </div>

        <div className="callout">
          <strong>Jogo responsável:</strong> use a Martingale com disciplina. Defina limites e não aposte mais do que pode perder.
        </div>

        <div className="page-ads-bottom"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
      </div>
    </div>
  );
}
