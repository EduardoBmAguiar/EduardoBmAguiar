// Gera assets/estatisticas.svg com o calendário de contribuições dos últimos 12 meses.
// Roda todo dia pela Action .github/workflows/estatisticas.yml (usa GITHUB_TOKEN).
// Local: GITHUB_TOKEN=$(gh auth token) npm run estatisticas
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { raiz, cor, painel, rotulo } from './base.mjs';

const USUARIO = 'EduardoBmAguiar';
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('Defina GITHUB_TOKEN.');

const consulta = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
  totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;

const resposta = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'perfil-readme' },
  body: JSON.stringify({ query: consulta, variables: { login: USUARIO } }),
});
const json = await resposta.json();
if (!resposta.ok || json.errors) throw new Error(`GitHub respondeu com erro: ${JSON.stringify(json.errors ?? resposta.status)}`);

const cal = json.data.user.contributionsCollection.contributionCalendar;
const semanas = cal.weeks;
const dias = semanas.flatMap((s) => s.contributionDays);

// sequências (dias seguidos com contribuição)
let maior = 0, corrida = 0;
for (const d of dias) {
  corrida = d.contributionCount > 0 ? corrida + 1 : 0;
  maior = Math.max(maior, corrida);
}
let atual = 0;
for (let i = dias.length - 1; i >= 0; i--) {
  if (dias[i].contributionCount > 0) atual++;
  else if (i === dias.length - 1) continue; // hoje ainda pode não ter commit
  else break;
}
const ativos = dias.filter((d) => d.contributionCount > 0).length;

const NIVEL = { NONE: cor.carvao2, FIRST_QUARTILE: '#2c3320', SECOND_QUARTILE: cor.oliva, THIRD_QUARTILE: '#b2471c', FOURTH_QUARTILE: cor.sinal };
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const L = 1000, A = 380, x0 = 40, y0 = 196, passo = 17, lado = 14;
let celulas = '', meses = '', mesAnterior = -1;
semanas.forEach((s, i) => {
  const x = x0 + i * passo;
  const primeiro = new Date(s.contributionDays[0].date + 'T12:00:00Z');
  const mes = primeiro.getUTCMonth();
  if (mes !== mesAnterior && primeiro.getUTCDate() <= 7 && i < semanas.length - 2) {
    meses += `<text x="${x}" y="${y0 - 12}">${MESES[mes]}</text>`;
    mesAnterior = mes;
  }
  s.contributionDays.forEach((d) => {
    const dia = new Date(d.date + 'T12:00:00Z').getUTCDay();
    celulas += `<rect x="${x}" y="${y0 + dia * passo}" width="${lado}" height="${lado}" rx="3" fill="${NIVEL[d.contributionLevel]}" style="animation-delay:${(i * 0.018).toFixed(2)}s"><title>${d.date}: ${d.contributionCount}</title></rect>`;
  });
});

const fmt = (n) => n.toLocaleString('pt-BR');
const numeros = [
  [fmt(cal.totalContributions), 'CONTRIBUIÇÕES'],
  [fmt(ativos), 'DIAS ATIVOS'],
  [fmt(maior), 'MAIOR SEQUÊNCIA'],
  [fmt(atual), 'SEQUÊNCIA ATUAL'],
];
const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
const yb = y0 + 7 * passo + 34;

const conteudo = `
${rotulo(40, 64, '06', 'No GitHub · últimos 12 meses')}
<text class="d" x="40" y="140" font-size="66" fill="${cor.osso}">EM <tspan class="s" font-weight="400" font-size="74" fill="${cor.sinal}">movimento</tspan></text>
${numeros
  .map(([n, r], i) => {
    const x = L - 40 - (numeros.length - 1 - i) * 118;
    return `<text class="d" x="${x}" y="120" font-size="50" fill="${i === 0 ? cor.sinal : cor.osso}" text-anchor="end">${n}</text>
<text class="m" x="${x}" y="142" font-size="9.5" fill="${cor.neblina}" text-anchor="end">${r}</text>`;
  })
  .join('\n')}
<g class="m" font-size="10" fill="${cor.neblina}">${meses}</g>
<g class="cel">${celulas}</g>
<g class="m" font-size="10" fill="${cor.neblina}">
  <text x="40" y="${yb}">MENOS</text>
  ${Object.values(NIVEL).map((c, i) => `<rect x="${92 + i * 17}" y="${yb - 11}" width="12" height="12" rx="3" fill="${c}"/>`).join('')}
  <text x="${92 + 5 * 17 + 6}" y="${yb}">MAIS</text>
  <text x="${L - 40}" y="${yb}" text-anchor="end">ATUALIZADO EM ${hoje}</text>
</g>`;

const svg = await painel({
  altura: A,
  css: '.cel rect{animation:surge .6s ease both}',
  titulo: `Atividade no GitHub nos últimos 12 meses: ${cal.totalContributions} contribuições, ${ativos} dias ativos, maior sequência de ${maior} dias.`,
  conteudo,
});
await writeFile(resolve(raiz, 'assets/estatisticas.svg'), svg);
console.log(`estatisticas.svg: ${cal.totalContributions} contribuições, ${ativos} dias ativos, sequência ${atual}/${maior}`);
