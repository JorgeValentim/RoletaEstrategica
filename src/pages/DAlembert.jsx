import React from 'react';
import '../style.css';
import RoletaImgD from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function DAlembert() {
  return (
    <div className="sobre-container">
      <h1>Estratégia D'Alembert</h1>

      {/* Google AdSense: topo */}
      <div style={{ maxWidth: 970, margin: "12px auto 16px", textAlign: "center" }}>
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>


      <section className="descricao">
        <p>
          A estratégia <strong>D'Alembert</strong> é uma das mais conhecidas no mundo das apostas. Ela é baseada na teoria de equilíbrio criada pelo matemático francês Jean-Baptiste le Rond d'Alembert. É considerada uma abordagem mais conservadora em comparação com o Martingale, oferecendo um ritmo de apostas mais moderado.
        </p>

        <p>
          <strong>Como funciona:</strong> Após cada <strong>derrota</strong>, você aumenta sua aposta em 1 unidade. Após cada <strong>vitória</strong>, você reduz sua aposta em 1 unidade. A ideia é equilibrar os ganhos e perdas com o tempo.
        </p>

        <div className="section">
          <h2>📊 Exemplo Prático</h2>
          <p>
            Suponha que sua unidade base seja R$ 10:
            <ul>
              <li>1ª aposta: R$ 10 → Perdeu</li>
              <li>2ª aposta: R$ 20 → Perdeu</li>
              <li>3ª aposta: R$ 30 → Ganhou</li>
              <li>4ª aposta: R$ 20 → Ganhou</li>
              <li>5ª aposta: R$ 10 → Ganhou</li>
            </ul>
            Ao final dessa sequência, mesmo com algumas perdas, o lucro é equilibrado de forma segura.
          </p>
        </div>

        <img src={RoletaImgD} alt="Roleta com estratégia D'Alembert" className="sobre-imagem" />

        <div className="section">
          <h2>✅ Pontos Positivos</h2>
          <ul>
            <li>Menor risco de perdas grandes.</li>
            <li>Mais fácil de controlar o saldo da banca.</li>
            <li>Ideal para jogadores mais cautelosos.</li>
          </ul>
        </div>

        <div className="section">
          <h2>⚠️ Pontos Negativos</h2>
          <ul>
            <li>Requer várias apostas para obter lucro real.</li>
            <li>Lucros menores em comparação a estratégias mais agressivas.</li>
            <li>Se perder muitas vezes seguidas, pode consumir a banca.</li>
          </ul>
        </div>

        <div className="responsavel">
          <h2>🎯 Lembrete</h2>
          <p>
            Jogue com responsabilidade. Essa estratégia ajuda no controle da banca, mas não garante lucros. Aposte apenas o que você pode perder.
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