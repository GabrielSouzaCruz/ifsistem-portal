# IFSISTEM — Portal

Página de entrada do IFSISTEM: mostra um card para cada módulo e leva ao sistema correspondente.
Site estático (HTML, CSS e JavaScript), sem build e sem dependências.

## Incluir um módulo novo

Edite o `modulos.json` e acrescente um item à lista:

```json
{"id": "meu-modulo", "nome": "Nome do módulo", "descricao": "O que ele faz.", "icone": "📌", "url": "https://exemplo.onrender.com/login.html", "ativo": true}
```

| Campo | Uso |
|---|---|
| `id` | identificador único, sem espaços nem acentos |
| `nome` | título do card |
| `descricao` | texto curto abaixo do título |
| `icone` | um emoji |
| `url` | endereço completo do módulo (abre na mesma aba) |
| `ativo` | `true` mostra o botão **Acessar**; `false` mostra o card cinza com "Em breve" |

Para liberar um módulo que já está na lista, preencha a `url` e troque `ativo` para `true`.
Os itens são separados por vírgula, sem vírgula depois do último. Faça o commit e o push na `main`.

## Rodar localmente

- **Servidor local** (lê o `modulos.json`, como no site publicado): `py -m http.server 8000` (Windows) ou `python3 -m http.server 8000` e abra <http://localhost:8000>.
- **Duplo clique no `index.html`**: o navegador bloqueia a leitura do `modulos.json` em `file://`, então o portal usa a
  cópia `MODULOS_LOCAL`, no início do `portal.js`. Ao mudar o `modulos.json`, atualize também essa cópia se quiser ver a
  mudança dessa forma; o site publicado não a usa.

## Deploy no Render

1. **New → Static Site** e escolha o repositório `ifsistem-portal`.
2. **Branch**: `main`.
3. **Build Command**: deixe em branco.
4. **Publish Directory**: `.`
5. **Create Static Site**. Com o Auto-Deploy ligado (padrão), cada push na `main` publica de novo.

## Licenças

As fontes Inter e Montserrat (`fonts/`) usam a licença SIL Open Font License 1.1, incluída na mesma pasta.
