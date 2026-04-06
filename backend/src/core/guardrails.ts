// ============================================================
// guardrails.ts — Filtres stricts de sécurité pour l'IA
// ============================================================

export const GUARDRAIL_RULES = {
  maxInputLength: 2000,
  blockedTopics: [
    'politique', 'religion', 'violence', 'sexe', 'adulte', 
    'hacking', 'phishing', 'suicide', 'illégal'
  ],
  contextRequired: ['école', 'scolaire', 'élève', 'professeur', 'classe', 'note', 'bulletin', 'absence', 'cours', 'madrassa', 'médicale', 'parent'],
  promptInjectionWords: ['ignore all previous', 'forget all', 'system prompt', 'you are now', 'bypassing']
};

export interface ValidationResult {
  pass: boolean;
  reason?: string;
  modifiedText?: string;
}

/**
 * Valide le message utilisateur entrant (Input Guardrails)
 * @param text - Message de l'utilisateur
 */
export function validateInput(text: string): ValidationResult {
  if (!text) return { pass: false, reason: "Message vide." };

  const lower = text.toLowerCase();

  // 1. Longueur maximale
  if (text.length > GUARDRAIL_RULES.maxInputLength) {
    return { pass: false, reason: `Message trop long (max ${GUARDRAIL_RULES.maxInputLength} caractères).` };
  }

  // 2. Détection d'injection de prompt
  for (const inject of GUARDRAIL_RULES.promptInjectionWords) {
    if (lower.includes(inject)) {
      return { pass: false, reason: "Tentative d'injection de prompt détectée." };
    }
  }

  // 3. Sujets bloqués
  for (const topic of GUARDRAIL_RULES.blockedTopics) {
    if (lower.includes(topic)) {
      return { pass: false, reason: `Le sujet '${topic}' est bloqué par la politique de sécurité de l'école.` };
    }
  }

  return { pass: true, modifiedText: text };
}

/**
 * Filtre les PII (Personnal Identifiable Information) basique dans la sortie (Output Guardrails)
 */
export function redactPII(text: string): string {
  // Remplacer les emails basiques
  let redacted = text.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '[EMAIL MASQUÉ]');
  
  // Remplacer certains patterns de téléphone (FR basique)
  redacted = redacted.replace(/(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})/g, '[TÉLÉPHONE MASQUÉ]');

  return redacted;
}
