
import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function DAlembert() {
  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <span className="badge">Estratégias</span>
            <h1>Estratégia D'Alembert</h1>
            <p className="lead">
              Progressão mais conservadora: aumente 1 unidade após perder e reduza 1 unidade ao vencer.
              Ideal para quem prefere variações suaves.
            </p>
          </div>
          {/* imagem com moldura de vidro */}
          <div className="hero-figure-frame">
            <img className="page-hero-figure" src={RoletaImg2} alt="Roleta — Estratégia D'Alembert" />
          </div>
        </div>
      </section>

      {/* 
      <div className="page-ads-top"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
      */}
      {/* CONTEÚDO */}
      <div className="page-wrap">
        <h2 className="section-title">Como aplicar</h2>
        <p>
          Defina sua <strong>unidade base</strong>. Se perder, some +1 unidade na próxima aposta; se ganhar, subtraia -1 unidade.
          Busque um ponto de equilíbrio sem saltos bruscos nos valores.
        </p>

        <div className="content-grid" style={{marginTop: 12}}>
          <div>
            <h3 className="section-title" style={{fontSize:22, marginTop:6}}>Exemplo prático</h3>
            <p>Unidade base de R$ 10:</p>
            <ul>
              <li>1ª aposta: R$ 10 → <strong>Perdeu</strong></li>
              <li>2ª aposta: R$ 20 → <strong>Perdeu</strong></li>
              <li>3ª aposta: R$ 30 → <strong>Ganhou</strong></li>
              <li>4ª aposta: R$ 20 → <strong>Ganhou</strong></li>
              <li>5ª aposta: R$ 10 → <strong>Ganhou</strong></li>
            </ul>
            <p>Lucros menores, porém com risco mais controlado.</p>
          </div>
          <img src={RoletaImg2} alt="Exemplo D'Alembert em roleta" />
        </div>

        <div className="k-cards">
          <div className="k-card">
            <h3>✅ Pontos positivos</h3>
            <ul>
              <li>Oscilações de valor mais suaves.</li>
              <li>Controle melhor do saldo.</li>
              <li>Boa para perfis cautelosos.</li>
            </ul>
          </div>
          <div className="k-card">
            <h3>⚠️ Pontos de atenção</h3>
            <ul>
              <li>Lucros mais lentos.</li>
              <li>Sequências ruins ainda podem pesar na banca.</li>
              <li>Requer paciência para resultados consistentes.</li>
            </ul>
          </div>
        </div>

        <div className="callout">
          <strong>Responsabilidade sempre:</strong> D'Alembert não elimina riscos — use metas e limites.
        </div>
        {/* 
        <div className="page-ads-bottom"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
        */}
        </div>
    </div>
  );
}
