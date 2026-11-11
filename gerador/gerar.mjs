// Gera os SVGs estáticos do README do perfil em assets/. Uso: npm run gerar
// (o painel de estatísticas é gerado à parte, pela Action, em gerador/estatisticas.mjs)
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { raiz, cor, esc, painel, rotulo, curvasDeNivel, imagemBase64 } from './base.mjs';

const saida = (nome) => resolve(raiz, 'assets', nome);

// ── 01 · capa ────────────────────────────────────────────────────────────────
async function capa() {
  const L = 1000, A = 580;
  const retrato = await imagemBase64('retrato.webp');
  const rh = 500, rw = Math.round((rh * 546) / 640);
  const conteudo = `
<radialGradient id="brilho" cx="72%" cy="55%" r="60%"><stop offset="0" stop-color="${cor.olivaEsc}"/><stop offset="1" stop-color="${cor.tinta}" stop-opacity="0"/></radialGradient>
<rect width="${L}" height="${A}" fill="url(#brilho)"/>
<g class="deriva"><path d="${curvasDeNivel(L + 60, A + 30, { semente: 11 })}" fill="none" stroke="${cor.sinal}" stroke-opacity=".16" stroke-width="1"/></g>

<text class="d" x="40" y="58" font-size="30" fill="${cor.osso}">E<tspan dx="13">B</tspan></text>
<circle cx="61.5" cy="49" r="3.6" fill="${cor.sinal}"/>
<g class="m" font-size="12.5" fill="${cor.osso}">
  <circle class="pulso" cx="${L - 270}" cy="49.5" r="4" fill="${cor.sinal}"/>
  <text x="${L - 40}" y="54" text-anchor="end">DISPONÍVEL PARA PROJETOS</text>
</g>

<text class="d sobe" x="70" y="292" font-size="268" textLength="860" lengthAdjust="spacingAndGlyphs" fill="${cor.osso}" style="animation-delay:.1s">EDUARDO</text>
<image class="surge" href="${retrato}" x="${(L - rw) / 2}" y="${A - rh}" width="${rw}" height="${rh}" style="animation-delay:.35s"/>
<text class="d sobe" x="70" y="${A - 24}" font-size="226" textLength="860" lengthAdjust="spacingAndGlyphs" fill="${cor.sinal}" style="animation-delay:.25s">BENJAMIN</text>

<g class="s surge" font-size="23" fill="${cor.osso}" style="animation-delay:.6s">
  <text x="40" y="314">Sites e sistemas <tspan fill="${cor.sinal}">sob medida.</tspan></text>
  <text x="40" y="339">Código com disciplina,</text>
  <text x="40" y="364">design com intenção.</text>
</g>
<g class="m surge" font-size="12" fill="${cor.neblina}" text-anchor="end" style="animation-delay:.6s">
  <text x="${L - 40}" y="318">22°53′S 43°06′W</text>
  <text x="${L - 40}" y="340">NITERÓI · RIO DE JANEIRO</text>
  <text x="${L - 40}" y="362" fill="${cor.osso}">EDUARDOBENJAMIN.VERCEL.APP ↗</text>
</g>`;
  return painel({
    altura: A,
    titulo: 'Eduardo Benjamin: sites e sistemas sob medida. Código com disciplina, design com intenção. Niterói, Rio de Janeiro. Disponível para projetos.',
    conteudo,
  });
}

// ── 02 · origem ──────────────────────────────────────────────────────────────
async function origem() {
  const L = 1000, A = 520;
  const boina = await imagemBase64('boina.webp');
  const fw = 300, fh = Math.round((fw * 491) / 420), fx = 40, fy = 56;
  const selo = 'SERVIR · CONSTRUIR · ENTREGAR · ';
  const fatos = [
    ['IDADE', '20 anos'],
    ['BASE', 'Niterói, RJ'],
    ['OFÍCIO', 'TI · Exército Brasileiro'],
    ['FORMAÇÃO', 'ADS · Estácio (em curso)'],
  ];
  const fatoX = [400, 690], fatoY = [372, 440];
  const conteudo = `
<text class="d" x="-30" y="440" font-size="360" textLength="1080" lengthAdjust="spacingAndGlyphs" fill="${cor.carvao2}">DISCIPLINA</text>

<clipPath id="foto"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="16"/></clipPath>
<image href="${boina}" x="${fx}" y="${fy}" width="${fw}" height="${fh}" clip-path="url(#foto)" preserveAspectRatio="xMidYMid slice"/>
<text class="m" x="${fx}" y="${fy + fh + 30}" font-size="11" fill="${cor.neblina}">ARQUIVO PESSOAL · A ENTREGA DA BOINA</text>

<g transform="translate(${fx + fw}, ${fy + fh - 40})">
  <circle r="56" fill="${cor.carvao}"/>
  <path id="circulo" d="M0,-42 a42,42 0 1,1 -0.1,0" fill="none"/>
  <g class="m" style="transform-origin:0 0;animation:gira 24s linear infinite">
    <text font-size="10.6" fill="${cor.sinal}" letter-spacing="2.2"><textPath href="#circulo">${selo}</textPath></text>
  </g>
  <circle r="5" fill="${cor.sinal}"/>
</g>

${rotulo(400, 84, '01', 'Origem')}
<text class="d" x="400" y="166" font-size="72" fill="${cor.osso}">ANTES DO CÓDIGO,</text>
<text class="d" x="400" y="236" font-size="72" fill="${cor.osso}">VEIO A <tspan class="s" font-weight="400" font-size="80" fill="${cor.sinal}">farda.</tspan></text>
<g class="t" font-size="17.5" fill="${cor.osso2}">
  <text x="400" y="282">Trabalho na área de informática do Exército Brasileiro:</text>
  <text x="400" y="306">suporte, redes e desenvolvimento. Prazo é compromisso,</text>
  <text x="400" y="330">e o que vai para o ar precisa aguentar.</text>
</g>
${fatos
  .map(([rot, val], i) => {
    const x = fatoX[i % 2], y = fatoY[Math.floor(i / 2)];
    return `<line x1="${x}" x2="${x + 260}" y1="${y - 22}" y2="${y - 22}" stroke="${cor.linha}"/>
<text class="m" x="${x}" y="${y}" font-size="11" fill="${cor.neblina}">${esc(rot)}</text>
<text class="t" x="${x}" y="${y + 26}" font-size="19" fill="${cor.osso}">${esc(val)}</text>`;
  })
  .join('\n')}`;
  return painel({
    altura: A,
    fundo: cor.carvao,
    titulo: 'Origem: antes do código, veio a farda. Trabalho na área de informática do Exército Brasileiro: suporte, redes e desenvolvimento. 20 anos, Niterói (RJ), cursando ADS na Estácio.',
    conteudo,
  });
}

// ── 03 · serviços ────────────────────────────────────────────────────────────
async function servicos() {
  const L = 1000, A = 650;
  const itens = [
    ['01', 'PRESENÇA', 'Sites & landing pages', ['O endereço do seu negócio na internet:', 'rápido, claro e feito para virar contato.'], ['Site institucional e portfólio', 'Landing page de campanha', 'Desempenho e SEO de base']],
    ['02', 'OPERAÇÃO', 'Sistemas web sob medida', ['O processo da sua empresa em uma tela só,', 'no lugar de planilhas soltas.'], ['Painéis, cadastros e relatórios', 'Login, papéis e permissões', 'Banco de dados seguro, com backup']],
    ['03', 'BOLSO', 'Apps PWA', ['Aplicativo instalado no celular do seu', 'cliente, sem depender de loja.'], ['Funciona em iPhone e Android', 'Notificações push', 'Ícone na tela inicial']],
    ['04', 'CONTINUIDADE', 'Manutenção & evolução', ['Cuido do que já existe: correções e', 'melhorias, sem recomeçar do zero.'], ['Ajustes e novas páginas', 'Atualização e segurança', 'Suporte contínuo']],
  ];
  const cw = 450, ch = 222;
  const cartoes = itens
    .map(([num, rot, titulo, desc, lista], i) => {
      const x = 40 + (i % 2) * (cw + 20), y = 190 + Math.floor(i / 2) * (ch + 20);
      return `<g transform="translate(${x},${y})">
  <rect width="${cw}" height="${ch}" rx="18" fill="${cor.carvao}" stroke="${cor.linha}"/>
  <text class="m" x="26" y="38" font-size="12" fill="${cor.sinal}">${num}<tspan fill="${cor.neblina}">  ${rot}</tspan></text>
  <text class="t" x="26" y="76" font-size="26" font-weight="600" fill="${cor.osso}" letter-spacing="-.4">${esc(titulo)}</text>
  ${desc.map((l, k) => `<text class="t" x="26" y="${106 + k * 21}" font-size="15" fill="${cor.neblina}">${esc(l)}</text>`).join('')}
  ${lista.map((l, k) => `<text class="m" x="26" y="${162 + k * 19}" font-size="11.5" fill="${cor.osso2}"><tspan fill="${cor.sinal}">→</tspan> ${esc(l.toUpperCase())}</text>`).join('')}
</g>`;
    })
    .join('\n');
  const conteudo = `
${rotulo(40, 64, '02', 'Serviços')}
<text class="d" x="40" y="146" font-size="76" fill="${cor.osso}">O QUE EU <tspan class="s" font-weight="400" font-size="86" fill="${cor.sinal}">faço</tspan></text>
<text class="t" x="${L - 40}" y="140" font-size="16" fill="${cor.neblina}" text-anchor="end">Quatro frentes, um mesmo padrão de entrega.</text>
${cartoes}`;
  return painel({
    altura: A,
    titulo: 'Serviços: sites e landing pages; sistemas web sob medida; apps PWA para iPhone e Android; manutenção e evolução de sites.',
    conteudo,
  });
}

// ── 04 · projeto em destaque: whatyoubuy ─────────────────────────────────────
async function whatyoubuy() {
  const L = 1000, A = 520;
  const t = cor.tinta;
  const fatos = [
    ['STACK', 'Next.js · React · TypeScript'],
    ['DADOS', 'Supabase · Postgres · RLS'],
    ['DO ZERO AO AR', '3 dias'],
    ['CUSTO MENSAL', 'R$ 0'],
  ];
  const fixas = [
    ['Internet', 'pago', '99,90', '#2f6f4a'],
    ['Academia', 'guardado', '89,00', '#2f4f7f'],
    ['Faculdade', 'pendente', '411,00', '#7a5a1d'],
    ['Celular', 'pago', '54,90', '#2f6f4a'],
  ];
  const px = 690, py = 236, pw = 262;
  const celular = `
<g transform="translate(${px},${py}) rotate(-4)">
  <rect width="${pw}" height="440" rx="40" fill="#141519" stroke="#2a2c33" stroke-width="2"/>
  <rect x="10" y="10" width="${pw - 20}" height="420" rx="31" fill="#0d0e11"/>
  <rect x="${pw / 2 - 44}" y="22" width="88" height="22" rx="11" fill="#000"/>
  <g class="t" fill="#f2f2f2">
    <text x="30" y="80" font-size="14" font-weight="600">Novembro 2026</text>
    <rect x="22" y="96" width="${pw - 44}" height="104" rx="16" fill="#191b20" stroke="#262830"/>
    <text x="36" y="122" font-size="11" fill="#8b8f99">Sobrou</text>
    <text x="36" y="154" font-size="27" font-weight="700">R$ 1.284,50</text>
    <text x="36" y="182" font-size="10.5" fill="#8b8f99">Entrou <tspan fill="#5fd38a">4.200,00</tspan>   Saiu <tspan fill="#ff6b6b">2.415,50</tspan></text>
    <text x="30" y="232" font-size="10" fill="#8b8f99" letter-spacing="1.2">FIXAS DO MÊS</text>
    ${fixas
      .map(([n, s, v, c], i) => {
        const y = 246 + i * 46;
        return `<rect x="22" y="${y}" width="${pw - 44}" height="38" rx="11" fill="#191b20"/>
    <text x="36" y="${y + 24}" font-size="12.5">${n}</text>
    <rect x="${pw - 142}" y="${y + 11}" width="${s.length * 6 + 14}" height="16" rx="8" fill="${c}"/>
    <text x="${pw - 135}" y="${y + 23}" font-size="9.5" fill="#e8e8e8">${s}</text>
    <text x="${pw - 34}" y="${y + 24}" font-size="12.5" font-weight="600" text-anchor="end">${v}</text>`;
      })
      .join('\n    ')}
  </g>
</g>`;
  const conteudo = `
${rotulo(40, 62, '03', 'Projeto em produção', { corTexto: '#5b5d52' })}
<text class="m" x="${L - 40}" y="62" font-size="13" fill="${t}" text-anchor="end">WHATYOUBUY.VERCEL.APP ↗</text>
<text class="d" x="34" y="200" font-size="138" fill="${t}">WHAT<tspan class="s" font-weight="400" font-size="154" fill="${cor.sinal}" dx="6">you</tspan><tspan dx="6">BUY</tspan></text>
${celular}
<g class="s" font-size="30" fill="${t}">
  <text x="40" y="296">Um app de controle de gastos que</text>
  <text x="40" y="330">responde a uma pergunta só:</text>
  <text x="40" y="364">quanto sobrou este mês?</text>
</g>
${fatos
  .map(([rot, val], i) => {
    const x = 40 + (i % 2) * 280, y = 424 + Math.floor(i / 2) * 58;
    return `<line x1="${x}" x2="${x + 250}" y1="${y - 20}" y2="${y - 20}" stroke="rgba(10,11,9,.18)"/>
<text class="m" x="${x}" y="${y}" font-size="10.5" fill="#5b5d52">${rot}</text>
<text class="t" x="${x}" y="${y + 23}" font-size="17" fill="${t}">${esc(val)}</text>`;
  })
  .join('\n')}`;
  return painel({
    altura: A,
    fundo: cor.osso,
    titulo: 'Projeto em produção: whatyoubuy, um app de controle de gastos (PWA) que responde quanto sobrou no mês. Next.js, React, TypeScript, Supabase e Postgres. Do zero ao ar em 3 dias, custo mensal zero. Abrir whatyoubuy.vercel.app.',
    conteudo,
  });
}

// ── 05 · outros projetos (faixas) ────────────────────────────────────────────
const PROJETOS = [
  {
    arquivo: 'projeto-portfolio.svg',
    num: '04', rotulo: 'PORTFÓLIO · NO AR', nome: 'EDUARDO BENJAMIN',
    desc: 'Site pessoal com narrativa por rolagem e fundo topográfico em WebGL.',
    stack: 'VITE · GSAP · LENIS · WEBGL · SEO', link: 'VISITAR ↗',
  },
  {
    arquivo: 'projeto-duas-marias.svg',
    num: '05', rotulo: 'LOJA VIRTUAL', nome: 'DUAS MARIAS',
    desc: 'Loja de roupas com catálogo por tamanho, carrinho, checkout e painel de pedidos.',
    stack: 'LARAVEL · PHP · BLADE', link: 'CÓDIGO PRIVADO',
  },
  {
    arquivo: 'projeto-museu.svg',
    num: '06', rotulo: 'API REST', nome: 'MUSEU DO EXÉRCITO',
    desc: 'API versionada para o acervo do museu: peças, categorias, imagens e login.',
    stack: 'LARAVEL · PHP · API REST · AUTENTICAÇÃO', link: 'CÓDIGO PRIVADO',
  },
];

async function faixaProjeto(p) {
  const L = 1000, A = 150;
  const aberto = p.link.includes('↗');
  const conteudo = `
<text class="d" x="34" y="112" font-size="104" fill="${cor.carvao2}">${p.num}</text>
<text class="m" x="150" y="44" font-size="11.5" fill="${cor.sinal}">${p.num}<tspan fill="${cor.neblina}">  ${esc(p.rotulo)}</tspan></text>
<text class="d" x="148" y="92" font-size="50" fill="${cor.osso}">${esc(p.nome)}</text>
<text class="t" x="150" y="120" font-size="15.5" fill="${cor.neblina}">${esc(p.desc)}</text>
<text class="m" x="${L - 40}" y="44" font-size="11" fill="${cor.neblina}" text-anchor="end">${esc(p.stack)}</text>
<g transform="translate(${L - 40},92)">
  <rect x="-${p.link.length * 9 + 34}" y="-22" width="${p.link.length * 9 + 34}" height="36" rx="18" fill="${aberto ? cor.sinal : 'none'}" stroke="${aberto ? cor.sinal : cor.linha}"/>
  <text class="m" x="-17" y="1" font-size="12" text-anchor="end" fill="${aberto ? cor.tinta : cor.neblina}">${esc(p.link)}</text>
</g>`;
  return painel({
    altura: A,
    fundo: cor.carvao,
    raio: 18,
    titulo: `Projeto ${p.nome.toLowerCase()}: ${p.desc} Tecnologias: ${p.stack.toLowerCase()}.`,
    conteudo,
  });
}

// ── 06 · faixa de ferramentas ────────────────────────────────────────────────
async function ferramentas() {
  const L = 1000, A = 150;
  const linha1 = ['NEXT.JS', 'REACT', 'TYPESCRIPT', 'TAILWIND', 'SUPABASE', 'POSTGRESQL', 'VERCEL', 'PWA'];
  const linha2 = ['Laravel', 'PHP', 'Java', 'Spring Boot', 'Docker', 'Git', 'CI/CD', 'Redes'];
  const W1 = 1500, W2 = 1300;
  const fileira = (itens, sep, w) =>
    itens.map((t) => `${esc(t)}<tspan fill="${cor.sinal}"> ${sep} </tspan>`).join('');
  const conteudo = `
<style>
@keyframes esq{from{transform:translateX(0)}to{transform:translateX(-${W1}px)}}
@keyframes dir{from{transform:translateX(-${W2}px)}to{transform:translateX(0)}}
.f1{animation:esq 38s linear infinite}.f2{animation:dir 34s linear infinite}
</style>
<g class="f1">
  ${[0, 1].map((k) => `<text class="d" x="${k * W1}" y="68" font-size="50" fill="${cor.osso}" textLength="${W1 - 30}" lengthAdjust="spacing">${fileira(linha1, '·')}</text>`).join('')}
</g>
<line x1="0" x2="${L}" y1="88" y2="88" stroke="${cor.linha}"/>
<g class="f2">
  ${[0, 1].map((k) => `<text class="s" x="${k * W2}" y="130" font-size="34" fill="${cor.neblina}" textLength="${W2 - 30}" lengthAdjust="spacing">${fileira(linha2, '+')}</text>`).join('')}
</g>`;
  return painel({
    altura: A,
    titulo: 'Ferramentas: Next.js, React, TypeScript, Tailwind, Supabase, PostgreSQL, Vercel, PWA, Laravel, PHP, Java, Spring Boot, Docker, Git, CI/CD e redes.',
    conteudo,
  });
}

// ── 07 · contato ─────────────────────────────────────────────────────────────
async function contato() {
  const L = 1000, A = 380;
  const conteudo = `
<g class="deriva"><path d="${curvasDeNivel(L + 60, A + 30, { semente: 4, niveis: 7 })}" fill="none" stroke="${cor.oliva}" stroke-opacity=".35" stroke-width="1"/></g>
${rotulo(40, 64, '07', 'Contato')}
<text class="d" x="34" y="208" font-size="150" fill="${cor.osso}">VAMOS</text>
<text class="d" x="34" y="330" font-size="136" fill="${cor.osso}">CONSTRUIR<tspan class="s" font-weight="400" font-size="150" fill="${cor.sinal}" dx="8">?</tspan></text>
<g class="t" font-size="18" fill="${cor.osso2}" text-anchor="end">
  <text x="${L - 40}" y="184">Tem um site, um sistema</text>
  <text x="${L - 40}" y="208">ou só uma ideia?</text>
  <text x="${L - 40}" y="232">Me escreva ou me chame.</text>
</g>
<g class="m" font-size="12" fill="${cor.neblina}" text-anchor="end">
  <text x="${L - 40}" y="296">NITERÓI · RIO DE JANEIRO · BRASIL</text>
  <text x="${L - 40}" y="320" fill="${cor.osso}"><tspan fill="${cor.sinal}">●</tspan> DISPONÍVEL PARA PROJETOS</text>
</g>`;
  return painel({
    altura: A,
    titulo: 'Vamos construir? Tem um site, um sistema ou só uma ideia? Me escreva ou me chame. Niterói, Rio de Janeiro. Disponível para projetos.',
    conteudo,
  });
}

// ── botões de contato ────────────────────────────────────────────────────────
const BOTOES = [
  ['botao-site.svg', 'SITE', 'Abrir o site eduardobenjamin.vercel.app', true],
  ['botao-whatsapp.svg', 'WHATSAPP', 'Conversar no WhatsApp'],
  ['botao-email.svg', 'E-MAIL', 'Enviar um e-mail'],
  ['botao-linkedin.svg', 'LINKEDIN', 'Abrir o LinkedIn'],
  ['botao-instagram.svg', 'INSTAGRAM', 'Abrir o Instagram'],
];

async function botao([, texto, titulo, destaque]) {
  const L = 186, A = 56;
  const conteudo = `
<rect x=".75" y=".75" width="${L - 1.5}" height="${A - 1.5}" rx="27.25" fill="${destaque ? cor.sinal : cor.carvao}" stroke="${destaque ? cor.sinal : 'rgba(234,229,216,.22)'}" stroke-width="1.5"/>
<text class="m" x="${L / 2 - 8}" y="${A / 2 + 5}" font-size="14" text-anchor="middle" fill="${destaque ? cor.tinta : cor.osso}">${texto}</text>
<text class="t" x="${L - 30}" y="${A / 2 + 6}" font-size="17" text-anchor="middle" fill="${destaque ? cor.tinta : cor.sinal}">↗</text>`;
  return painel({ largura: L, altura: A, raio: 28, fundo: 'none', titulo, conteudo });
}

// ── execução ─────────────────────────────────────────────────────────────────
await mkdir(resolve(raiz, 'assets'), { recursive: true });
const tarefas = [
  ['capa.svg', capa()],
  ['origem.svg', origem()],
  ['servicos.svg', servicos()],
  ['projeto-whatyoubuy.svg', whatyoubuy()],
  ...PROJETOS.map((p) => [p.arquivo, faixaProjeto(p)]),
  ['ferramentas.svg', ferramentas()],
  ['contato.svg', contato()],
  ...BOTOES.map((b) => [b[0], botao(b)]),
];
for (const [nome, promessa] of tarefas) {
  const svg = await promessa;
  await writeFile(saida(nome), svg);
  console.log(`${nome.padEnd(26)} ${(Buffer.byteLength(svg) / 1024).toFixed(0)} KB`);
}
