import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function Fibonacci() {
  return (
    <div className="sobre-container">
      <h1>Estratégia Fibonacci</h1>

      {/* Google AdSense: topo */}
      <div style={{ maxWidth: 970, margin: "12px auto 16px", textAlign: "center" }}>
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>


      <section className="descricao">
        <p>
          A <strong>Estratégia Fibonacci</strong> é baseada na famosa sequência matemática onde cada número é a soma dos dois anteriores: 1, 1, 2, 3, 5, 8, 13, etc.
          Essa estratégia é usada nas apostas como uma forma estruturada de recuperar perdas ao longo do tempo.
        </p>

        <p>
          <strong>Como funciona:</strong> a cada <strong>perda</strong>, você avança para o próximo número da sequência e aumenta sua aposta de acordo. Quando vence, volta duas casas na sequência.
        </p>

        <div className="section">
          <h2>📊 Exemplo Prático</h2>
          <p>
            Suponha que sua unidade base seja R$ 10:
            <ul>
              <li>1ª aposta: R$ 10 (1) → Perdeu</li>
              <li>2ª aposta: R$ 10 (1) → Perdeu</li>
              <li>3ª aposta: R$ 20 (2) → Perdeu</li>
              <li>4ª aposta: R$ 30 (3) → Ganhou</li>
              <li>Volta duas casas: próxima aposta volta ao valor R$ 10 (1)</li>
            </ul>
            O objetivo é recuperar as perdas sem aumentar demais o valor apostado.
          </p>
        </div>

        <img src={RoletaImg2} alt="Roleta com estratégia Fibonacci" className="sobre-imagem" />

        <div className="section">
          <h2>✅ Pontos Positivos</h2>
          <ul>
            <li>Mais segura que Martingale em longas sequências.</li>
            <li>Permite recuperar perdas sem apostas absurdas.</li>
            <li>Base matemática interessante para controlar a banca.</li>
          </ul>
        </div>

        <div className="section">
          <h2>⚠️ Pontos Negativos</h2>
          <ul>
            <li>Sequências longas ainda podem comprometer a banca.</li>
            <li>Requer paciência e disciplina.</li>
            <li>Nem sempre recupera todo o prejuízo com rapidez.</li>
          </ul>
        </div>

        <div className="responsavel">
          <h2>🎯 Jogo Responsável</h2>
          <p>
            A estratégia Fibonacci ajuda no controle de perdas, mas não garante lucros. Utilize com responsabilidade, e nunca aposte mais do que está disposto a perder.
          </p>
        </div>
      </section>
      {/* Google AdSense: rodapé da página */}
      <div style={{ maxWidth: 970, margin: "24px auto", textAlign: "center" }}>
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>
      // BOTTOM_ADS_MARK

    </div>
  );
}