
import React from 'react';
import '../style.css';
import RoletaImg1 from '../assets/Roleta_img_1.png';
import AdBanner from '../components/AdBanner';

export default function Sobre() {
  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <div>
            <span className="badge">Institucional</span>
            <h1>Sobre nós</h1>
            <p className="lead">
              O <strong>Roleta Estratégica</strong> foi criado para oferecer simuladores e guias
              que ajudam você a jogar com disciplina, foco e responsabilidade.
            </p>
          </div>
          {/* imagem com moldura de vidro */}
          <div className="hero-figure-frame">
            <img className="page-hero-figure" src={RoletaImg1} alt="Mesa de roleta com fichas" />
          </div>
        </div>
      </section>

      <div className="page-ads-top"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>

      {/* CONTEÚDO */}
      <div className="page-wrap">
        <h2 className="section-title">Nossa proposta</h2>
        <p>
          Trazer conteúdo claro e ferramentas simples para que você possa entender as estratégias
          mais famosas da roleta antes de arriscar seu dinheiro.
        </p>

        <h2 className="section-title">Como você pode apoiar</h2>
        <p className="section-sub">Se este projeto te ajuda, considere apoiar:</p>
        <div className="k-cards">
          <div className="k-card">
            <h3>💚 PIX</h3>
            <p style={{marginTop:6}}><strong>apoio@roletaestrategicabr.com.br</strong></p>
          </div>
          <div className="k-card">
            <h3>📧 Contato</h3>
            <p style={{marginTop:6}}><strong>contato@roletaestrategicabr.com.br</strong></p>
          </div>
        </div>

        <div className="callout">
          <strong>Jogo responsável:</strong> conteúdo destinado a maiores de 18 anos. Não use apostas como renda principal.
        </div>

        <div className="page-ads-bottom"><AdBanner slot="8827435481" style={{ minHeight: 90 }} /></div>
      </div>
    </div>
  );
}
