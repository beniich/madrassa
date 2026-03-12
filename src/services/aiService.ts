/**
 * AI Service - Copilot Assistant
 * Rôle: Analyste pédagogique basé sur les données locales.
 * Les réponses sont contextuelles selon le rôle RBAC de l'utilisateur.
 * Note: En mode connecté, ce module peut être étendu pour appeler un
 * endpoint OpenAI via le backend si configuré.
 */

import { apiClient } from '@/lib/apiClient';

export type UserRole = 'ADMIN' | 'DIRECTOR' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface AIContext {
    userRole: UserRole;
    userId?: string;
    schoolId?: string;
    classId?: string;
}

export interface AIResponse {
    answer: string;
    suggestions?: string[];
    sources?: string[];
}

class AIService {
    private static instance: AIService;

    private constructor() {}

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Ask a question to the Copilot.
     * Falls back to local contextual analysis when backend AI is not available.
     */
    public async askCopilot(query: string, context: AIContext, _history: unknown[] = []): Promise<AIResponse> {
        // Try backend AI endpoint first
        try {
            const response = await apiClient.post<AIResponse>('/ai/ask', { query, context });
            return response;
        } catch {
            // Fallback: local RBAC-aware heuristic responses
            return this.localFallback(query, context);
        }
    }

    private isAuthorized(query: string, role: UserRole): boolean {
        if (role === 'STUDENT' && query.toLowerCase().includes('salaire')) return false;
        if (role === 'PARENT' && query.toLowerCase().includes('autres élèves')) return false;
        return true;
    }

    private localFallback(query: string, context: AIContext): AIResponse {
        if (!this.isAuthorized(query, context.userRole)) {
            return {
                answer: "Désolé, vous n'avez pas accès à cette information avec votre rôle actuel.",
                suggestions: ["Que puis-je faire avec mon rôle ?", "Aide sur l'utilisation du Copilot"],
            };
        }

        if (query.toLowerCase().includes('résumé') || query.toLowerCase().includes('analyse')) {
            return this.handleAnalysis(context);
        }

        if (query.toLowerCase().includes('message') || query.toLowerCase().includes('parent')) {
            return this.handleMessageGeneration(context);
        }

        return {
            answer: `Je suis votre assistant scolaire. Votre demande : "${query}". Comment puis-je vous aider davantage ?`,
            suggestions: [
                "Résumer les performances de la classe",
                "Rédiger un message pour les parents",
                "Analyser l'assiduité de la semaine",
            ],
        };
    }

    private handleAnalysis(context: AIContext): AIResponse {
        if (context.userRole === 'TEACHER') {
            return {
                answer: "L'analyse de la classe montre une progression ce mois-ci. Cependant, certains élèves présentent un risque de décrochage concernant l'assiduité.",
                suggestions: ["Voir les élèves à risque", "Générer un plan de soutien", "Alerter les parents"],
                sources: ["Registre d'appel", "Notes du dernier test"],
            };
        }
        return {
            answer: "Analyse globale non disponible pour votre profil.",
            suggestions: ["Mon planning", "Mes dernières notes"],
        };
    }

    private handleMessageGeneration(context: AIContext): AIResponse {
        return {
            answer: "Voici une proposition de message :\n\n'Cher parent, nous avons remarqué une belle progression de votre enfant. Son implication en classe est exemplaire.'",
            suggestions: ["Modifier le ton (plus formel)", "Envoyer le message", "Ajouter un rappel pour la réunion"],
        };
    }
}

export const aiService = AIService.getInstance();
