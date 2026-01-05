
import { AIContext, AIResponse, UserRole } from '../types/school-365';

class AIService {
    private static instance: AIService;

    private constructor() { }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    // Simulations d'IA avec contextes métiers
    public async askCopilot(query: string, context: AIContext, history: any[] = []): Promise<AIResponse> {
        console.log('[Copilot] Analyse de la requête avec contexte:', context);

        // Simulation de délai
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Logique de sécurité / Policy Engine
        if (!this.isAuthorized(query, context.userRole)) {
            return {
                answer: "Désolé, je ne suis pas autorisé à accéder à ces informations ou à effectuer cette action avec votre rôle actuel.",
                suggestions: ["Que puis-je faire avec mon rôle ?", "Aide sur l'utilisation du Copilot"]
            };
        }

        // Moteur de réponses simulées par contexte
        if (query.toLowerCase().includes('résumé') || query.toLowerCase().includes('analyse')) {
            return this.handleAnalysis(context);
        }

        if (query.toLowerCase().includes('message') || query.toLowerCase().includes('parent')) {
            return this.handleMessageGeneration(context);
        }

        return {
            answer: `Je suis votre assistant scolaire intelligent. J'ai bien reçu votre demande : "${query}". Comment puis-je vous aider davantage dans votre mission pédagogique ?`,
            suggestions: [
                "Résumer les performances de la classe",
                "Rédiger un message pour les parents",
                "Analyser l'assiduité de la semaine"
            ]
        };
    }

    private isAuthorized(query: string, role: UserRole): boolean {
        // Exemple de RBAC strict
        if (role === 'STUDENT' && query.toLowerCase().includes('salaire')) return false;
        if (role === 'PARENT' && query.toLowerCase().includes('autres élèves')) return false;
        return true;
    }

    private handleAnalysis(context: AIContext): AIResponse {
        if (context.userRole === 'TEACHER') {
            return {
                answer: "L'analyse de la classe 4B montre une progression de 15% en Mathématiques ce mois-ci. Cependant, 3 élèves sont en risque de décrochage concernant l'assiduité.",
                suggestions: ["Voir les élèves à risque", "Générer un plan de soutien", "Envoyer une alerte aux parents"],
                sources: ["Registre d'appel", "Notes du dernier test"]
            };
        }
        return {
            answer: "Analyse globale non disponible pour votre profil.",
            suggestions: ["Mon planning", "Mes dernières notes"]
        };
    }

    private handleMessageGeneration(context: AIContext): AIResponse {
        return {
            answer: "Voici une proposition de message pour les parents d'Ahmed :\n\n'Cher parent, nous avons remarqué une belle progression d'Ahmed en Français. Son implication en classe est exemplaire.'",
            suggestions: ["Modifier le ton (plus formel)", "Envoyer le message", "Ajouter un rappel pour la réunion"]
        };
    }
}

export const aiService = AIService.getInstance();
