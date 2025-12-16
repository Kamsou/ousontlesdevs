# OSLD - Ou Sont Les Developpeuses

Annuaire des developpeuses en France. Trouvez des talents tech feminins, des speakers pour vos conferences, et des entreprises inclusives.

**Site** : [ousontlesdeveloppeuses.fr](https://ousontlesdeveloppeuses.fr)

## Fonctionnalites

- **Annuaire** : Profils de developpeuses avec competences, localisation et disponibilites
- **Speakers Bureau** : Trouvez des intervenantes pour vos evenements tech
- **Entreprises Inclusives** : Avis et notes sur les entreprises par la communaute

## Stack technique

- **Frontend** : Nuxt 4, Vue 3, TypeScript
- **Backend** : Nitro (Nuxt Server)
- **Database** : Turso (SQLite) + Drizzle ORM
- **Auth** : GitHub OAuth via @sidebase/nuxt-auth
- **Deploiement** : Netlify

## Quick Start

### Prerequisites

- Node.js 20+
- Compte [Turso](https://turso.tech) (gratuit)
- [GitHub OAuth App](https://github.com/settings/developers)

### Installation

```bash
# Clone le repo
git clone https://github.com/Kamsou/ousontlesdevs.git
cd ousontlesdevs

# Installe les dependances
npm install

# Copie les variables d'environnement
cp .env.example .env
# Remplis les valeurs dans .env

# Lance le serveur de dev
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000)

### Variables d'environnement

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | URL de ta base Turso |
| `TURSO_AUTH_TOKEN` | Token d'auth Turso |
| `AUTH_SECRET` | Secret pour les sessions |
| `GITHUB_CLIENT_ID` | Client ID de ton OAuth App GitHub |
| `GITHUB_CLIENT_SECRET` | Client Secret de ton OAuth App GitHub |
| `NUXT_PUBLIC_AUTH_BASE_URL` | URL de l'API auth (localhost ou prod) |

### Scripts

```bash
npm run dev      # Serveur de developpement
npm run build    # Build production
npm run preview  # Preview du build
```

## Structure du projet

```
ousontlesdevs/
├── app/
│   ├── pages/          # Pages Vue (annuaire, speakers, entreprises, profil)
│   └── app.vue         # Layout principal
├── server/
│   ├── api/            # Endpoints API
│   ├── db/
│   │   ├── schema.ts   # Schema Drizzle
│   │   └── migrations/ # Migrations SQL
│   └── utils/
│       └── db.ts       # Connexion Turso
├── public/             # Assets statiques
├── nuxt.config.ts      # Config Nuxt
└── drizzle.config.ts   # Config Drizzle
```

## Contribuer

Les contributions sont les bienvenues ! Consulte [CONTRIBUTING.md](CONTRIBUTING.md) pour commencer.

## Code de conduite

Ce projet suit le [Contributor Covenant](CODE_OF_CONDUCT.md). En participant, tu t'engages a respecter ces regles.

## Licence

MIT
