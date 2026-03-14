// src/controllers/ai.controller.js
const OpenAI = require("openai");

// Initialisation OpenAI (Optionnel: Fallback si pas de clé)
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * POST /api/ai/ask
 * Point d'entrée pour l'assistant pédagogique AI
 */
const askCopilot = async (req, res, next) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: "La question est requise." });
    }

    // Extraction du contexte (Rôle, Établissement, etc.)
    const userRole = context?.userRole || "STUDENT";
    const schoolName = context?.schoolName || "SchoolGenius User";

    // Si pas de clé OpenAI, on utilise une logique heuristique (structure "IA locale")
    if (!openai) {
      return res.json(getLocalFallbackResponse(query, userRole));
    }

    // Construction du Prompt Système basé sur le rôle
    const systemPrompt = getSystemPrompt(userRole, schoolName);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0].message.content;
    const suggestions = getSuggestionsByRole(userRole, query);

    res.json({
      answer,
      suggestions,
      sources: ["Base de données scolaire", "Analyse pédagogique IA"],
    });

  } catch (err) {
    console.error("[AI Error]", err);
    next(err);
  }
};

/**
 * Génère un prompt système adapté au rôle de l'utilisateur
 */
function getSystemPrompt(role, schoolName) {
  const basePrompt = `Vous êtes un assistant IA intégré à SchoolGenius, une plateforme de gestion scolaire moderne. Votre nom est "Copilot". Votre ton est professionnel, encourageant et concis. Vous parlez au nom de l'établissement "${schoolName}".`;
  
  const rolePrompts = {
    ADMIN: `${basePrompt} En tant qu'ADMINISTRATEUR, vous avez accès aux données globales : finances, RH, infrastructures. Aidez l'utilisateur à optimiser la gestion de l'école.`,
    DIRECTOR: `${basePrompt} En tant que DIRECTEUR, vous vous focalisez sur le pilotage stratégique : taux d'assiduité, performances globales, relations parents-profs.`,
    TEACHER: `${basePrompt} En tant qu'ENSEIGNANT, vous aidez dans la pédagogie : rédaction de commentaires de bulletins, analyse du niveau de la classe, idées de leçons.`,
    STUDENT: `${basePrompt} En tant qu'ÉLÈVE, vous êtes un tuteur pédagogique. Aidez l'élève à comprendre ses cours, son planning et ses notes sans faire ses exercices à sa place.`,
    PARENT: `${basePrompt} En tant que PARENT, vous informez sur le suivi de l'enfant : absences, prochaines évaluations, messages de la direction.`,
  };

  return rolePrompts[role] || rolePrompts.STUDENT;
}

/**
 * Suggestions intelligentes basées sur la question et le rôle
 */
function getSuggestionsByRole(role, lastQuery) {
  const suggestions = {
    TEACHER: ["Générer un plan de soutien", "Rédiger un email aux parents", "Analyser les notes du trimestre"],
    ADMIN: ["Rapport financier mensuel", "Statistiques de présence", "Paramètres de sécurité"],
    STUDENT: ["Mon emploi du temps", "Calculer ma moyenne", "Prochaines évaluations"],
  };
  return suggestions[role] || ["Aide sur l'utilisation du Copilot"];
}

/**
 * Logique de repli (Heuristique) si OpenAI n'est pas configuré
 */
function getLocalFallbackResponse(query, role) {
  const normalizedQuery = query.toLowerCase();
  
  let answer = `[Mode Local] Je suis votre assistant SchoolGenius. (Clé API manquante pour une analyse profonde). Votre demande : "${query}".`;
  
  if (normalizedQuery.includes("moyenne") || normalizedQuery.includes("notes")) {
    answer = "L'analyse des notes montre une tendance stable. Pour une analyse détaillée par matière, veuillez consulter l'onglet Académique.";
  } else if (normalizedQuery.includes("absent") || normalizedQuery.includes("présence")) {
    answer = "Le taux de présence global est de 94%. Deux alertes d'absences injustifiées ont été détectées aujourd'hui.";
  }

  return {
    answer,
    suggestions: getSuggestionsByRole(role, query),
    sources: ["Store local", "Heuristiques système"],
    isMock: true
  };
}

module.exports = { askCopilot };
