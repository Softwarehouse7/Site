# House Software

Site institucional da House Software, feito com React, TypeScript e Vite.

## Executar localmente

**Pré-requisitos:** Node.js 20.19 ou superior e Bun.

```bash
bun install --frozen-lockfile
bun run dev
```

O Vite disponibiliza o site em `http://localhost:3000`.

## Publicar no GitHub Pages

1. Envie o projeto para um repositório GitHub.
2. No repositório, abra **Settings > Pages** e selecione **GitHub Actions** como origem da publicação.
3. Envie uma alteração para a branch `main` (ou execute manualmente o workflow **Deploy to GitHub Pages** na aba **Actions**).
4. Quando o workflow terminar, o endereço publicado estará disponível em **Settings > Pages**.

O workflow instala as dependências usando o `bun.lock` e constrói o site para o caminho do repositório automaticamente.

## Firebase

O site usa Firebase Authentication e Cloud Firestore. Antes da publicação, confirme que [firebase-config.json](./firebase-config.json) aponta para o projeto Firebase desejado, que o domínio do GitHub Pages está autorizado no Firebase Authentication e que as regras do Firestore estão publicadas e revisadas.

A configuração web do Firebase é enviada ao navegador e não é uma credencial secreta. Restrinja a chave de API no Google Cloud e nunca inclua credenciais administrativas ou chaves privadas neste repositório.

### Proteção contra abuso e imagens

1. Cadastre o domínio do site no Firebase App Check com reCAPTCHA v3 e preencha `recaptchaSiteKey` em `firebase-config.json` com a chave pública do site.
2. No Firebase Console, habilite a aplicação web no App Check e aplique a fiscalização do App Check ao Cloud Firestore e ao Cloud Storage. Sem a chave e a fiscalização ativada, o App Check não bloqueia envios automatizados; os formulários também usam campos honeypot como filtro básico.
3. Publique as regras do Cloud Storage: `firebase deploy --only storage --project <id-do-projeto>`.
4. Publique o site para disponibilizar o migrador. Entre no painel administrativo, abra a aba **Geral** e use **Migrar imagens antigas** para transferir imagens já armazenadas no Firestore.
5. Depois que a migração terminar, publique as regras atualizadas do Firestore: `firebase deploy --only firestore:rules --project <id-do-projeto>`. Elas limitam os campos de imagem a URLs.

Novas imagens escolhidas no painel são enviadas ao Cloud Storage e somente a URL fica no Firestore. As imagens externas coladas como link continuam aceitas.
