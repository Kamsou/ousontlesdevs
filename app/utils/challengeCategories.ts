export interface ChallengePack {
  id: string
  title: string
  description: string
  comingSoon?: boolean
  categories: readonly { readonly value: string; readonly label: string; readonly description: string }[]
}

export interface ChallengeTemplate {
  id: string
  packId: string
  title: string
  description: string
  example: string
  category: string
  difficulty: 1 | 2 | 3
}

export const challengeLevels = [
  { level: 1, name: 'Débutante', minXp: 0 },
  { level: 2, name: 'Initiée', minXp: 25 },
  { level: 3, name: 'Exploratrice', minXp: 70 },
  { level: 4, name: 'Stratège', minXp: 150 },
  { level: 5, name: 'Experte', minXp: 250 }
]

export function getXpForDifficulty(difficulty: 1 | 2 | 3): number {
  return difficulty === 1 ? 10 : difficulty === 2 ? 25 : 50
}

export const challengePacks: ChallengePack[] = [
  {
    id: 'ia',
    title: 'Comment utiliser l\'IA sans se griller le cerveau',
    description: 'Apprends à bosser AVEC l\'IA sans perdre tes réflexes de dev.',
    categories: [
      { value: 'comparer', label: 'Comparer', description: 'Faire avec et sans IA, comparer les résultats' },
      { value: 'verifier', label: 'Vérifier', description: 'Checker, auditer, décortiquer l\'output de l\'IA' },
      { value: 'enseigner', label: 'Enseigner', description: 'Expliquer un concept pour mieux le comprendre' },
      { value: 'collaborer', label: 'Collaborer', description: 'Pair programming et dialogue structuré avec l\'IA' },
      { value: 'resister', label: 'Résister', description: 'Coder sans IA pour rester sharp' }
    ]
  },
  {
    id: 'visibilite',
    title: 'Avoir de la visibilité',
    description: 'Être reconnue pour son travail, sortir de l\'ombre.',
    comingSoon: true,
    categories: [
      { value: 'partager', label: 'Partager', description: 'Montrer ce qu\'on fait, sans attendre la perfection' },
      { value: 'ecrire', label: 'Écrire', description: 'Articles, REX, threads : poser ses idées par écrit' },
      { value: 'parler', label: 'Prendre la parole', description: 'Meetups, confs, lightning talks : oser le micro' },
      { value: 'reseauter', label: 'Réseauter', description: 'Se connecter, s\'entourer, s\'entraider entre devs' }
    ]
  }
]

export const challengeTemplates: ChallengeTemplate[] = [
  // --- COMPARER ---
  {
    id: 'review-croise',
    packId: 'ia',
    title: 'Le Review Croisé',
    description: 'Review ton propre code, puis demande à l\'IA de le reviewer. Compare vos deux listes.',
    example: 'Ouvre un composant que tu as écrit récemment.\nNote 3 choses que tu changerais.\nColle le même code dans l\'IA et demande-lui de le reviewer.\nCompare ta liste et la sienne : qu\'est-ce qu\'elle voit que toi non ?',
    category: 'comparer',
    difficulty: 1
  },
  {
    id: 'avec-sans',
    packId: 'ia',
    title: 'Le Même Bug, Deux Chemins',
    description: 'Un bug ? Debug 15 min seule, puis demande à l\'IA. Note qui trouve en premier.',
    example: 'La prochaine fois que tu as un bug, mets un timer de 15 min.\nDebug avec tes outils : console.log, debugger, docs.\nQuand le timer sonne, donne le même bug à l\'IA.\nNote qui a trouvé en premier, et laquelle des deux solutions est plus fiable.',
    category: 'comparer',
    difficulty: 1
  },
  {
    id: 'refacto-battle',
    packId: 'ia',
    title: 'La Refacto Battle',
    description: 'Refactorise une grosse fonction toi-même, puis demande à l\'IA de faire pareil sur l\'originale.',
    example: 'Trouve une fonction de +30 lignes dans ton code.\nRefactorise-la toi-même, à ta façon.\nDonne l\'originale (pas ta version) à l\'IA et demande-lui de refactoriser.\nCompare les deux : laquelle est la plus lisible pour ton équipe ?',
    category: 'comparer',
    difficulty: 2
  },

  // --- VÉRIFIER ---
  {
    id: 'fact-checker',
    packId: 'ia',
    title: 'Le Fact-Checker',
    description: 'L\'IA t\'explique un concept que tu maîtrises. Repère ce qui est vrai, approximatif ou faux.',
    example: 'Choisis un sujet technique que tu maîtrises bien.\nDemande à l\'IA de te l\'expliquer en détail.\nLis chaque point et classe-le : vrai, approximatif ou faux.\nTu sauras maintenant quand lui faire confiance sur ce sujet.',
    category: 'verifier',
    difficulty: 1
  },
  {
    id: 'audit-confiance',
    packId: 'ia',
    title: 'L\'Audit de Confiance',
    description: 'Génère du code avec l\'IA. Lis chaque ligne et note : "je comprends" ou "je comprends pas".',
    example: 'Demande à l\'IA de coder quelque chose pour toi.\nLis le résultat ligne par ligne.\nPour chaque ligne, écris à côté : "ok" ou "je comprends pas".\nRègle : si tu as plus de 2 "je comprends pas", ne mets pas ce code en prod.',
    category: 'verifier',
    difficulty: 1
  },
  {
    id: 'test-piege',
    packId: 'ia',
    title: 'Le Test Piège',
    description: 'L\'IA génère des tests pour ta fonction. Avant de les lancer, prédit lesquels vont passer.',
    example: 'Prends une de tes fonctions et donne-la à l\'IA.\nDemande-lui de générer des tests unitaires.\nAvant de les lancer, lis chaque test et note ta prédiction : passe ou échoue.\nLance les tests. Compare tes prédictions avec la réalité.',
    category: 'verifier',
    difficulty: 2
  },
  {
    id: 'glossaire-vivant',
    packId: 'ia',
    title: 'Le Glossaire Vivant',
    description: 'L\'IA résout un problème. Repère chaque terme inconnu et cherche-le toi-même.',
    example: 'Donne un problème technique à l\'IA.\nDans sa réponse, surligne chaque mot ou concept que tu ne connais pas.\nPour chacun, va chercher la définition dans la doc officielle (pas l\'IA).\nRésultat : 1 problème résolu + plusieurs concepts appris.',
    category: 'verifier',
    difficulty: 1
  },

  // --- ENSEIGNER ---
  {
    id: 'traducteur-inverse',
    packId: 'ia',
    title: 'Le Traducteur Inversé',
    description: 'Explique un concept technique à l\'IA comme si elle était junior. Ses questions = tes trous.',
    example: 'Choisis un concept technique que tu utilises souvent.\nDis à l\'IA : "Tu es une dev junior. Je vais t\'expliquer X."\nExplique-lui avec tes mots.\nChaque question qu\'elle te pose = un trou dans ta compréhension. Reformule jusqu\'à zéro question.',
    category: 'enseigner',
    difficulty: 1
  },
  {
    id: 'rubber-duck-ia',
    packId: 'ia',
    title: 'Le Rubber Duck++',
    description: 'Tu bloques ? Explique ton problème en détail à l\'IA AVANT de demander la solution.',
    example: 'La prochaine fois que tu bloques, ouvre un chat avec l\'IA.\nÉcris ton problème en détail : contexte, ce que tu as essayé, où tu coinces.\nNe lui demande PAS la solution. Juste décris.\nSouvent, le fait de formuler te débloque toute seule.',
    category: 'enseigner',
    difficulty: 1
  },
  {
    id: 'prof-exigeante',
    packId: 'ia',
    title: 'La Best Practice',
    description: 'L\'IA code une feature. Ne valide jamais la v1. Demande : best practice ? perf ? lisible pour mon équipe ?',
    example: 'Demande à l\'IA de coder une feature.\nRéponds : "C\'est la best practice ?"\nPuis : "C\'est performant ?"\nPuis : "C\'est lisible pour une équipe qui utilise [ton stack] ?"\nCompare la v1 et la v3. Ne prends jamais la v1 telle quelle.',
    category: 'enseigner',
    difficulty: 2
  },

  // --- COLLABORER ---
  {
    id: 'pair-invisible',
    packId: 'ia',
    title: 'Le Pair Invisible',
    description: 'Pair programming : TOI tu décides de l\'archi, l\'IA implémente ce que tu décris.',
    example: 'Choisis une petite feature à implémenter.\nÉcris à l\'IA l\'architecture que tu veux : fichiers, structure, approche.\nLaisse-la coder uniquement ce que tu as décrit.\nRelis : est-ce que le résultat correspond à ta vision ?',
    category: 'collaborer',
    difficulty: 2
  },
  {
    id: 'prompt-architect',
    packId: 'ia',
    title: 'Le Prompt Architect',
    description: 'Même tâche, 3 prompts : vague, moyen, ultra-précis. Compare les résultats.',
    example: 'Choisis une tâche que tu dois faire aujourd\'hui.\nPrompt 1 : décris-la en une phrase vague.\nPrompt 2 : ajoute le contexte (ton stack, tes contraintes).\nPrompt 3 : précise tout (structure, conventions de ton équipe, cas limites).\nCompare les 3 résultats. Le niveau de détail du prompt change tout.',
    category: 'collaborer',
    difficulty: 1
  },
  {
    id: 'iterateur',
    packId: 'ia',
    title: 'L\'Itérateur',
    description: 'Construis le code en 4-5 étapes avec l\'IA. Note quand elle perd le fil.',
    example: 'Demande à l\'IA une version minimale de ta feature.\nAjoute une fonctionnalité : "Maintenant ajoute X."\nPuis une autre : "Ajoute aussi Y."\nÀ chaque itération, vérifie : est-ce qu\'elle a gardé les étapes précédentes ?\nNote le moment où elle commence à oublier.',
    category: 'collaborer',
    difficulty: 2
  },
  {
    id: 'deuxieme-passe',
    packId: 'ia',
    title: 'La Deuxième Passe',
    description: 'L\'IA te donne du code ? Demande 3 passes : refacto, perf, conventions de ton équipe.',
    example: 'Récupère du code généré par l\'IA.\nDemande : "Refactorise pour la lisibilité."\nPuis : "Optimise la performance."\nPuis : "Adapte aux conventions de mon équipe : [précise-les]."\nCompare la v1 et la v4. Ne prends jamais la v1.',
    category: 'collaborer',
    difficulty: 2
  },

  // --- RÉSISTER ---
  {
    id: 'solo-sprint',
    packId: 'ia',
    title: 'Le Solo Sprint',
    description: '1h sans IA. Note chaque envie de l\'utiliser. Ta liste = la carte de tes forces et faiblesses.',
    example: 'Mets un timer d\'1h. Ferme tous les chats IA.\nCode normalement sur ta tâche en cours.\nÀ chaque fois que tu as envie d\'utiliser l\'IA, note pourquoi (ex : "regex", "syntaxe CSS").\nÀ la fin, relis ta liste : ce sont tes points faibles à bosser.',
    category: 'resister',
    difficulty: 1
  },
  {
    id: 'from-scratch',
    packId: 'ia',
    title: 'Le From Scratch',
    description: 'Recode un utilitaire que tu importes tout le temps. Sans IA, sans copier.',
    example: 'Choisis un utilitaire ou une fonction que tu importes tout le temps sans réfléchir.\nOuvre un fichier vide.\nImplémente-le from scratch, sans IA, sans copier-coller, sans regarder le source.\nCompare avec l\'original. Tu comprends enfin ce que tu importais.',
    category: 'resister',
    difficulty: 2
  },
  {
    id: 'documentation-first',
    packId: 'ia',
    title: 'Le Documentation First',
    description: '20 min dans la doc officielle AVANT de demander à l\'IA. Note ce que tu trouves et ce qui manque.',
    example: 'Tu veux utiliser une nouvelle API ou feature.\nOuvre la doc officielle et mets un timer de 20 min.\nNote ce que tu trouves et ce que tu ne trouves pas.\nAprès le timer, demande à l\'IA. Tu comprendras sa réponse au lieu de la copier.',
    category: 'resister',
    difficulty: 1
  }
]
