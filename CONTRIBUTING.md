# Contribuer a OSLD

Merci de vouloir contribuer a OSLD ! Ce projet est fait pour et par la communaute des developpeuses.

## Avant de commencer

- Lis le [Code de conduite](CODE_OF_CONDUCT.md)
- Regarde les [issues ouvertes](https://github.com/Kamsou/ousontlesdevs/issues) pour voir ce qui est en cours
- Les issues avec le label `good first issue` sont parfaites pour debuter

## Setup local

### Prerequis

- Node.js 20+
- Un compte [Turso](https://turso.tech) (gratuit)
- Une [GitHub OAuth App](https://github.com/settings/developers)

### 1. Fork et clone

```bash
# Fork le repo sur GitHub, puis clone ton fork
git clone https://github.com/TON-USERNAME/ousontlesdevs.git
cd ousontlesdevs
```

### 2. Installe les dependances

```bash
npm install
```

### 3. Configure l'environnement

```bash
cp .env.example .env
```

Remplis les variables dans `.env` :

**Turso (Database)**
1. Cree un compte sur [turso.tech](https://turso.tech)
2. Cree une database
3. Copie l'URL et le token

**GitHub OAuth**
1. Va sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cree une OAuth App
3. Homepage URL : `http://localhost:3000`
4. Callback URL : `http://localhost:3000/api/auth/callback/github`
5. Copie le Client ID et Client Secret

**AUTH_SECRET**
```bash
# Genere un secret aleatoire
openssl rand -base64 32
```

### 4. Lance le serveur

```bash
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000)

## Workflow de contribution

### 1. Cree une branche

```bash
git checkout -b feature/ma-nouvelle-feature
# ou
git checkout -b fix/correction-bug
```

### 2. Fais tes modifications

- Respecte le style de code existant
- Ajoute des types TypeScript si necessaire
- Teste tes modifications localement

### 3. Commit

```bash
git add .
git commit -m "feat: description de la feature"
```

**Conventions de commit :**
- `feat:` nouvelle fonctionnalite
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, pas de changement de code
- `refactor:` refactoring du code

### 4. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-feature
```

Puis ouvre une Pull Request sur GitHub.

## Structure du code

```
app/pages/       # Pages Vue
server/api/      # Endpoints API
server/db/       # Schema et migrations Drizzle
```

## Questions ?

Ouvre une [issue](https://github.com/Kamsou/ousontlesdevs/issues) ou contacte-nous !
