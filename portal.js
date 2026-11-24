'use strict';

/* Portal publico: monta os cards a partir de modulos.json. Modulo inativo vira card sem link. */

/* Copia de modulos.json usada SO quando o index.html e aberto direto do disco (file://), onde o
 * navegador bloqueia o fetch. No site publicado vale sempre o modulos.json. */
const MODULOS_LOCAL = [
  {"id": "aproveitamento", "nome": "Aproveitamento de Disciplinas", "descricao": "Solicite e acompanhe o aproveitamento de disciplinas.", "icone": "🎓", "url": "https://aproveitamento-ifsistem.onrender.com/login.html", "ativo": true},
  {"id": "chaves", "nome": "Salas, Reservas e Chaves", "descricao": "Reserva de salas e controle de chaves.", "icone": "🔑", "url": "", "ativo": false},
  {"id": "atendimento", "nome": "Atendimento ao Aluno", "descricao": "Canal de atendimento e protocolos.", "icone": "💬", "url": "", "ativo": false},
  {"id": "biblioteca", "nome": "Biblioteca", "descricao": "Acervo, empréstimos e renovações.", "icone": "📚", "url": "", "ativo": false},
  {"id": "em-breve", "nome": "Em breve", "descricao": "Novos módulos chegando ao IFSISTEM.", "icone": "✨", "url": "", "ativo": false}
];

function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
}

function card(m) {
    const c = el('article', 'modulo' + (m.ativo ? '' : ' inativo'));
    c.appendChild(el('span', 'modulo-icone', m.icone || ''));
    c.appendChild(el('h2', null, m.nome));
    c.appendChild(el('p', 'muted', m.descricao));
    if (m.ativo && m.url) {
        const a = el('a', 'btn', 'Acessar');
        a.href = m.url; // sem target: abre sempre na mesma aba
        c.appendChild(a);
    } else {
        c.appendChild(el('span', 'selo-breve', 'Em breve'));
    }
    return c;
}

function carregar() {
    if (location.protocol === 'file:') return Promise.resolve(MODULOS_LOCAL);
    return fetch('modulos.json').then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    });
}

carregar()
    .then(lista => document.getElementById('modulos').replaceChildren(...lista.map(card)))
    .catch(() => {
        document.getElementById('modulos').textContent = 'Não foi possível carregar os módulos.';
    });
