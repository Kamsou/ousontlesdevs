interface ChallengeTemplate {
  id: string
  packId: string
  title: string
  description: string
  category: string
}

export const challengeTemplates: ChallengeTemplate[] = [
  { id: 'review-croise', packId: 'ia', title: 'Le Review Croisé', description: 'Review ton propre code, puis demande à l\'IA de le reviewer. Compare vos deux listes.', category: 'comparer' },
  { id: 'avec-sans', packId: 'ia', title: 'Le Même Bug, Deux Chemins', description: 'Un bug ? Debug 15 min seule, puis demande à l\'IA. Note qui trouve en premier.', category: 'comparer' },
  { id: 'refacto-battle', packId: 'ia', title: 'La Refacto Battle', description: 'Refactorise une grosse fonction toi-même, puis demande à l\'IA de faire pareil sur l\'originale.', category: 'comparer' },
  { id: 'fact-checker', packId: 'ia', title: 'Le Fact-Checker', description: 'L\'IA t\'explique un concept que tu maîtrises. Repère ce qui est vrai, approximatif ou faux.', category: 'verifier' },
  { id: 'audit-confiance', packId: 'ia', title: 'L\'Audit de Confiance', description: 'Génère du code avec l\'IA. Lis chaque ligne et note : "je comprends" ou "je comprends pas".', category: 'verifier' },
  { id: 'test-piege', packId: 'ia', title: 'Le Test Piège', description: 'L\'IA génère des tests pour ta fonction. Avant de les lancer, prédit lesquels vont passer.', category: 'verifier' },
  { id: 'glossaire-vivant', packId: 'ia', title: 'Le Glossaire Vivant', description: 'L\'IA résout un problème. Repère chaque terme inconnu et cherche-le toi-même.', category: 'verifier' },
  { id: 'traducteur-inverse', packId: 'ia', title: 'Le Traducteur Inversé', description: 'Explique un concept technique à l\'IA comme si elle était junior. Ses questions = tes trous.', category: 'enseigner' },
  { id: 'rubber-duck-ia', packId: 'ia', title: 'Le Rubber Duck++', description: 'Tu bloques ? Explique ton problème en détail à l\'IA AVANT de demander la solution.', category: 'enseigner' },
  { id: 'prof-exigeante', packId: 'ia', title: 'La Best Practice', description: 'L\'IA code une feature. Ne valide jamais la v1. Demande : best practice ? perf ? lisible pour mon équipe ?', category: 'enseigner' },
  { id: 'pair-invisible', packId: 'ia', title: 'Le Pair Invisible', description: 'Pair programming : TOI tu décides de l\'archi, l\'IA implémente ce que tu décris.', category: 'collaborer' },
  { id: 'prompt-architect', packId: 'ia', title: 'Le Prompt Architect', description: 'Même tâche, 3 prompts : vague, moyen, ultra-précis. Compare les résultats.', category: 'collaborer' },
  { id: 'iterateur', packId: 'ia', title: 'L\'Itérateur', description: 'Construis le code en 4-5 étapes avec l\'IA. Note quand elle perd le fil.', category: 'collaborer' },
  { id: 'deuxieme-passe', packId: 'ia', title: 'La Deuxième Passe', description: 'L\'IA te donne du code ? Demande 3 passes : refacto, perf, conventions de ton équipe.', category: 'collaborer' },
  { id: 'solo-sprint', packId: 'ia', title: 'Le Solo Sprint', description: '1h sans IA. Note chaque envie de l\'utiliser. Ta liste = la carte de tes forces et faiblesses.', category: 'resister' },
  { id: 'from-scratch', packId: 'ia', title: 'Le From Scratch', description: 'Recode un utilitaire que tu importes tout le temps. Sans IA, sans copier.', category: 'resister' },
  { id: 'documentation-first', packId: 'ia', title: 'Le Documentation First', description: '20 min dans la doc officielle AVANT de demander à l\'IA. Note ce que tu trouves et ce qui manque.', category: 'resister' }
]
