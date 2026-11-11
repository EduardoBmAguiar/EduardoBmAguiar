// Base comum dos SVGs do perfil: cores da identidade visual, fontes embutidas (recortadas
// só para os caracteres usados) e o campo topográfico de fundo.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import subsetFont from 'subset-font';

export const raiz = resolve(import.meta.dirname, '..');

export const cor = {
  tinta: '#0a0b09',
  carvao: '#11130e',
  carvao2: '#181b13',
  oliva: '#56613a',
  olivaEsc: '#1d2116',
  osso: '#eae5d8',
  osso2: '#d9d3c3',
  neblina: '#9a9c8e',
  sinal: '#ff4d1a',
  linha: 'rgba(234,229,216,.14)',
};

// Caracteres que os textos podem usar (latim + acentos do português + pontuação gráfica).
const CARACTERES =
  Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') +
  'ÀÁÂÃÇÉÊÍÓÔÕÚàáâãçéêíóôõú·→↗↑●′″°—–‘’“”×';

const FONTES = {
  BS: 'big-shoulders.woff2',
  IS: 'instrument-serif-italico.woff2',
  G: 'geist.woff2',
  GM: 'geist-mono.woff2',
};

const cache = new Map();
async function fonteBase64(apelido, caracteres = CARACTERES) {
  const chave = apelido + caracteres;
  if (!cache.has(chave)) {
    const original = await readFile(resolve(raiz, 'gerador/fontes', FONTES[apelido]));
    const recorte = await subsetFont(original, caracteres, { targetFormat: 'woff2' });
    cache.set(chave, recorte.toString('base64'));
  }
  return cache.get(chave);
}

// Caracteres realmente usados nos textos de um SVG (a fonte embutida leva só esses).
function caracteresDe(conteudo) {
  const texto = conteudo
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  return [...new Set(texto + ' ')].sort().join('');
}

export async function imagemBase64(nome) {
  const dados = await readFile(resolve(raiz, 'gerador/imagens', nome));
  return `data:image/webp;base64,${dados.toString('base64')}`;
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS_BASE = `
.d{font-family:BS,'Arial Narrow',sans-serif;font-weight:900}
.s{font-family:IS,Georgia,serif;font-style:italic}
.t{font-family:G,system-ui,'Segoe UI',sans-serif}
.m{font-family:GM,ui-monospace,Consolas,monospace;letter-spacing:.12em}
@keyframes pulso{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes sobe{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes surge{from{opacity:0}to{opacity:1}}
@keyframes deriva{from{transform:translate(0,0)}to{transform:translate(-36px,-14px)}}
@keyframes gira{to{transform:rotate(360deg)}}
.pulso{animation:pulso 2.2s ease-in-out infinite}
.sobe{animation:sobe 1.1s cubic-bezier(.22,1,.36,1) both}
.surge{animation:surge 1.4s ease both}
.deriva{animation:deriva 22s ease-in-out infinite alternate}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

/** Monta um painel SVG completo, com fundo arredondado, título acessível e só as fontes usadas. */
export async function painel({ largura = 1000, altura, titulo, fundo = cor.tinta, css = '', conteudo, raio = 22 }) {
  const usadas = Object.keys(FONTES).filter((apelido) => {
    const classe = { BS: 'd', IS: 's', G: 't', GM: 'm' }[apelido];
    return new RegExp(`class="[^"]*\\b${classe}\\b`).test(conteudo);
  });
  const usados = caracteresDe(conteudo);
  const faces = (
    await Promise.all(
      usadas.map(
        async (a) =>
          `@font-face{font-family:${a};src:url(data:font/woff2;base64,${await fonteBase64(a, usados)}) format('woff2');font-weight:100 900}`,
      ),
    )
  ).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" role="img" aria-labelledby="titulo">
<title id="titulo">${esc(titulo)}</title>
<style>${faces}${CSS_BASE}${css}</style>
<defs><clipPath id="moldura"><rect width="${largura}" height="${altura}" rx="${raio}"/></clipPath></defs>
<g clip-path="url(#moldura)">
<rect width="${largura}" height="${altura}" fill="${fundo}"/>
${conteudo}
</g>
</svg>`;
}

/** Rótulo de seção no estilo do site: "(02)  SERVIÇOS". */
export const rotulo = (x, y, numero, texto, { corTexto = cor.neblina, anchor = 'start' } = {}) =>
  `<text class="m" x="${x}" y="${y}" font-size="13" text-anchor="${anchor}" fill="${corTexto}"><tspan fill="${cor.sinal}">(${numero})</tspan>  ${esc(texto.toUpperCase())}</text>`;

// ── campo topográfico (curvas de nível de um ruído suave, por marching squares) ──
function ruido(semente) {
  const p = new Uint8Array(512);
  let s = semente;
  const aleatorio = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const base = Array.from({ length: 256 }, (_, i) => i).sort(() => aleatorio() - 0.5);
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const v = (x, y) => p[(p[x & 255] + y) & 255] / 255;
  const suave = (t) => t * t * (3 - 2 * t);
  const valor = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = suave(x - xi), yf = suave(y - yi);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x, y) => valor(x, y) * 0.6 + valor(x * 2.1 + 7, y * 2.1 + 3) * 0.28 + valor(x * 4.3 + 1, y * 4.3 + 9) * 0.12;
}

/** Devolve o atributo d de um path com as curvas de nível que cobrem largura × altura. */
export function curvasDeNivel(largura, altura, { semente = 7, passo = 10, escala = 0.006, niveis = 9 } = {}) {
  const f = ruido(semente);
  const cols = Math.ceil(largura / passo) + 1, linhas = Math.ceil(altura / passo) + 1;
  const g = [];
  for (let j = 0; j <= linhas; j++) {
    g[j] = [];
    for (let i = 0; i <= cols; i++) g[j][i] = f(i * passo * escala, j * passo * escala);
  }
  const r = (n) => Math.round(n * 10) / 10;
  let d = '';
  for (let k = 1; k <= niveis; k++) {
    const nivel = 0.18 + (k / (niveis + 1)) * 0.64;
    for (let j = 0; j < linhas; j++) {
      for (let i = 0; i < cols; i++) {
        const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], e = g[j + 1][i];
        const x = i * passo, y = j * passo;
        const pts = [];
        const corta = (v1, v2, x1, y1, x2, y2) => {
          if ((v1 < nivel) !== (v2 < nivel)) {
            const t = (nivel - v1) / (v2 - v1);
            pts.push([r(x1 + (x2 - x1) * t), r(y1 + (y2 - y1) * t)]);
          }
        };
        corta(a, b, x, y, x + passo, y);
        corta(b, c, x + passo, y, x + passo, y + passo);
        corta(e, c, x, y + passo, x + passo, y + passo);
        corta(a, e, x, y, x, y + passo);
        if (pts.length >= 2) d += `M${pts[0][0]} ${pts[0][1]}L${pts[1][0]} ${pts[1][1]}`;
        if (pts.length === 4) d += `M${pts[2][0]} ${pts[2][1]}L${pts[3][0]} ${pts[3][1]}`;
      }
    }
  }
  return d;
}
