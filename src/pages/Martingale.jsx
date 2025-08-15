import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import AdBanner from '../components/AdBanner';

export default function Martingale() {
  return (
    <div className="sobre-container">
      <h1>Estratégia Martingale</h1>

      {/* Google AdSense: topo */}
      <div style={{ maxWidth: 970, margin: "12px auto 16px", textAlign: "center" }}>
        <AdBanner slot="8827435481" style={{ minHeight: 90 }} />
      </div>


      <section className="descricao">
        <p>
          A <strong>Estratégia Martingale</strong> é uma das mais populares entre apostadores. Ela se baseia na ideia de que, após cada perda, você deve <strong>dobrar sua aposta</strong> para que, ao vencer, recupere todas as perdas anteriores e ainda obtenha lucro.
        </p>

        <p>
          Essa estratégia é amplamente utilizada em apostas de probabilidade simples, como vermelho/preto ou par/ímpar na roleta.
        </p>

        <div className="section">
          <h2>📊 Exemplo Prático</h2>
          <p>
            Suponha que sua aposta inicial seja R$ 10:
            <ul>
              <li>1ª aposta: R$ 10 → Perdeu</li>
              <li>2ª aposta: R$ 20 → Perdeu</li>
              <li>3ª aposta: R$ 40 → Perdeu</li>
              <li>4ª aposta: R$ 80 → Ganhou</li>
            </ul>
            Ao ganhar a quarta rodada, você recupera R$ 70 em perdas anteriores e ainda lucra R$ 10.
          </p>
        </div>

        <img src={RoletaImg2} alt="Roleta com estratégia Martingale" className="sobre-imagem" />

        <div className="section">
          <h2>✅ Pontos Positivos</h2>
          <ul>
            <li>Alto potencial de recuperação rápida de perdas.</li>
            <li>Simples de aplicar e entender.</li>
            <li>Boa para jogos de 50/50 como vermelho/preto.</li>
          </ul>
        </div>

        <div className="section">
          <h2>⚠️ Pontos Negativos</h2>
          <ul>
            <li>Requer banca alta para suportar longas sequências de perdas.</li>
            <li>Risco de atingir limite da mesa antes de recuperar.</li>
            <li>Pode levar a grandes perdas rapidamente.</li>
          </ul>
        </div>

        <div className="responsavel">
          <h2>🎯 Jogo Responsável</h2>
          <p>
            Martingale pode parecer fácil, mas também é arriscada. Use com responsabilidade e nunca aposte mais do que está disposto a perder.
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