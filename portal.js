'use strict';

/* Portal publico: monta os cards a partir de modulos.json. Modulo inativo vira card sem link. */

/* Copia de modulos.json usada SO quando o index.html e aberto direto do disco (file://), onde o
 * navegador bloqueia o fetch. No site publicado vale sempre o modulos.json. */
const MODULOS_LOCAL = [
  {"id": "aproveitamento", "nome": "Aproveitamento de Disciplinas", "descricao": "Solicite e acompanhe o aproveitamento de disciplinas.", "icone": "formatura", "url": "https://aproveitamento-ifsistem.onrender.com/login.html", "ativo": true},
  {"id": "chaves", "nome": "Salas, Reservas e Chaves", "descricao": "Reserva de salas e controle de chaves.", "icone": "chave", "url": "https://chaves-ifsistem.vercel.app", "ativo": true},
  {"id": "atendimento", "nome": "Atendimento ao Aluno", "descricao": "Canal de atendimento e protocolos.", "icone": "conversa", "url": "", "ativo": false},
  {"id": "biblioteca", "nome": "Biblioteca", "descricao": "Acervo, empréstimos e renovações.", "icone": "livro", "url": "", "ativo": false},
  {"id": "em-breve", "nome": "Em breve", "descricao": "Novos módulos chegando ao IFSISTEM.", "icone": "brilho", "url": "", "ativo": false}
];

/* Desenhos disponiveis para o campo "icone" (traco 24x24). Qualquer outro texto, como um emoji, e mostrado como esta. */
const ICONES = {
    formatura: ['M2 9.5 12 5l10 4.5L12 14 2 9.5Z', 'M6 11.5V16c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-4.5', 'M22 9.5V15'],
    chave: ['M12 15.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z', 'M10.8 12.2 20 3', 'M16.5 6.5l3 3', 'M13.5 9.5l2 2'],
    conversa: ['M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z', 'M7.5 9.5h9', 'M7.5 13h5.5'],
    livro: ['M12 6.5C10 5 7 4.5 3 4.5v13c4 0 7 .5 9 2 2-1.5 5-2 9-2v-13c-4 0-7 .5-9 2Z', 'M12 6.5v13'],
    brilho: ['M11 4l1.9 5.1L18 11l-5.1 1.9L11 18l-1.9-5.1L4 11l5.1-1.9L11 4Z', 'M19 16v5', 'M16.5 18.5h5']
};

function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
}

function svg(tracos) {
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    tracos.forEach(d => {
        const p = document.createElementNS(ns, 'path');
        p.setAttribute('d', d);
        s.appendChild(p);
    });
    return s;
}

function icone(nome) {
    const desenho = Object.hasOwn(ICONES, nome) ? ICONES[nome] : null;
    const i = el('span', 'modulo-icone', desenho ? null : nome || '');
    i.setAttribute('aria-hidden', 'true');
    if (desenho) i.appendChild(svg(desenho));
    return i;
}

const disponivel = m => Boolean(m.ativo && m.url);

function card(m) {
    const c = el('article', 'modulo' + (disponivel(m) ? '' : ' inativo'));
    c.appendChild(icone(m.icone));
    c.appendChild(el('h3', null, m.nome));
    c.appendChild(el('p', null, m.descricao));
    if (disponivel(m)) {
        const a = el('a', 'btn', 'Acessar');
        a.href = m.url; // sem target: abre sempre na mesma aba
        a.setAttribute('aria-label', 'Acessar ' + m.nome);
        a.appendChild(svg(['M5 12h14', 'M13 6l6 6-6 6']));
        c.appendChild(a);
    } else {
        c.appendChild(el('span', 'selo-breve', 'Em breve'));
    }
    return c;
}

function grupo(titulo, classe, lista) {
    if (!lista.length) return [];
    const s = el('section', 'grupo');
    const g = el('div', 'portal-grade ' + classe);
    g.append(...lista.map(card));
    s.append(el('h2', null, titulo), g);
    return [s];
}

function carregar() {
    if (location.protocol === 'file:') return Promise.resolve(MODULOS_LOCAL);
    return fetch('modulos.json').then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    });
}

carregar()
    .then(lista => document.getElementById('modulos').replaceChildren(
        ...grupo('Módulos disponíveis', 'ativos', lista.filter(disponivel)),
        ...grupo('Próximos módulos', 'proximos', lista.filter(m => !disponivel(m)))))
    .catch(() => {
        document.getElementById('modulos').textContent = 'Não foi possível carregar os módulos.';
    });
