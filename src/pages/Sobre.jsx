import React from 'react';
import '../style.css';
import RoletaImg2 from '../assets/Roleta_img_2.png';
import RoletaImg1 from '../assets/Roleta_img_1.png';

function Sobre() {
  return (
    <div className="sobre-container">
      <h1>Sobre nós</h1>

      <section className="descricao">
        <p>
          Bem-vindo ao <strong>Roleta Estratégica</strong>, um projeto criado para ajudar você a <strong>lucrar com a roleta</strong> de forma consciente e inteligente. Aqui você encontrará estratégias que visam <strong>aumentar seus lucros</strong> e <strong>minimizar as perdas</strong>, evitando que você jogue dinheiro fora.
        </p>
        <div className="imagens-roleta">
          <img src={RoletaImg1} alt="Mesa de roleta" />
        </div>
      </section>

      <section className="apoio">
        <h2>❤️ Apoie este projeto</h2>
        <p>
          Se este site está te ajudando, considere contribuir com qualquer valor para mantermos o projeto no ar e melhorar ainda mais a experiência:
        </p>
        <div className="destaque-box">
          <strong>PIX:</strong> apoio@roletaestrategicabr.com.br
        </div>
      </section>

      <section className="contato">
        <h2>📧 Fale com a gente</h2>
        <p>
          Caso tenha dúvidas, sugestões ou queira entrar em contato com o criador, envie um e-mail para:
        </p>
        <div className="destaque-box">
          <strong>contato@roletaestrategicabr.com.br</strong>
        </div>
      </section>

      <section className="responsavel">
        <h2>⚠️ Jogo responsável</h2>
        <p>
          Este site é destinado exclusivamente a maiores de <strong>18 anos</strong>. Encorajamos o <strong>jogo responsável</strong>: nunca aposte mais do que pode perder e jamais use o jogo como forma de renda principal. Aposte com consciência, equilíbrio e responsabilidade.
        </p>
      </section>
      {/*}
      <footer className="footer">
        <p>© 2025 Roleta Estratégica. Todos os direitos reservados.</p>
      </footer>
      */}
    </div>
  );
}

export default Sobre;
