// Medical AI Service - Mock implementation for demonstration
// In production, this would connect to an AI API (OpenAI, Claude, etc.)

import { Patient } from '@/stores/useHospitalStore';
import { MedicalEvent } from '@/stores/usePatientTimelineStore';

export interface AISummary {
    summary: string;
    keyPoints: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
}

export interface AIConsultationReport {
    date: string;
    patientName: string;
    reason: string;
    findings: string;
    diagnosis: string;
    plan: string;
    followUp: string;
}

export interface AIPrescription {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    warnings: string[];
}

// Generate a clinical summary for a patient
export async function summarizePatientRecord(
    patient: Patient,
    events: MedicalEvent[]
): Promise<AISummary> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI response based on patient data
    const hasAllergies = patient.allergies && patient.allergies.length > 0;
    const hasCriticalEvents = events.some(e => e.severity === 'critical');

    const summary = `${patient.first_name} ${patient.last_name}, patient ${patient.status === 'admitted' ? 'hospitalisé' : 'en consultation externe'}. ` +
        `${patient.diagnosis ? `Diagnostic principal: ${patient.diagnosis}. ` : ''}` +
        `${patient.admissionReason ? `Motif d'admission: ${patient.admissionReason}. ` : ''}` +
        `${hasAllergies ? `⚠️ Allergies connues: ${patient.allergies?.join(', ')}. ` : ''}` +
        `${events.length} événements enregistrés dans le dossier.`;

    const keyPoints: string[] = [];
    if (patient.diagnosis) keyPoints.push(`Diagnostic: ${patient.diagnosis}`);
    if (hasAllergies) keyPoints.push(`Allergies: ${patient.allergies?.join(', ')}`);
    if (patient.medicalHistory?.length) keyPoints.push(`Antécédents: ${patient.medicalHistory.length} éléments`);
    keyPoints.push(`Dernière visite: ${new Date(patient.last_visit).toLocaleDateString('fr-FR')}`);

    const recommendations: string[] = [];
    if (hasAllergies) recommendations.push('Vérifier les contre-indications médicamenteuses');
    if (hasCriticalEvents) recommendations.push('Surveillance rapprochée recommandée');
    recommendations.push('Mise à jour du dossier après chaque intervention');

    const riskLevel: AISummary['riskLevel'] =
        hasCriticalEvents ? 'high' : hasAllergies ? 'medium' : 'low';

    return { summary, keyPoints, recommendations, riskLevel };
}

// Generate a consultation report
export async function generateConsultationReport(
    patient: Patient,
    consultationData: {
        reason: string;
        findings: string;
        diagnosis?: string;
    }
): Promise<AIConsultationReport> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        date: new Date().toLocaleDateString('fr-FR'),
        patientName: `${patient.first_name} ${patient.last_name}`,
        reason: consultationData.reason,
        findings: consultationData.findings,
        diagnosis: consultationData.diagnosis || patient.diagnosis || 'En cours d\'évaluation',
        plan: `Suite à l'examen, il est recommandé de poursuivre le traitement en cours et d'effectuer un suivi dans 2 semaines.`,
        followUp: 'Consultation de contrôle dans 14 jours'
    };
}

// Suggest prescription based on symptoms
export async function suggestPrescription(
    symptoms: string[],
    patientAllergies: string[] = []
): Promise<AIPrescription[]> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock suggestions based on common symptoms
    const suggestions: AIPrescription[] = [];

    if (symptoms.some(s => s.toLowerCase().includes('douleur'))) {
        suggestions.push({
            medication: 'Paracétamol',
            dosage: '1000mg',
            frequency: '3 fois par jour',
            duration: '5 jours',
            warnings: patientAllergies.includes('Paracétamol') ? ['⚠️ ALLERGIE DÉTECTÉE'] : []
        });
    }

    if (symptoms.some(s => s.toLowerCase().includes('fièvre'))) {
        suggestions.push({
            medication: 'Ibuprofène',
            dosage: '400mg',
            frequency: '2 fois par jour',
            duration: '3 jours',
            warnings: ['À prendre pendant les repas']
        });
    }

    if (symptoms.some(s => s.toLowerCase().includes('infection'))) {
        if (!patientAllergies.includes('Pénicilline')) {
            suggestions.push({
                medication: 'Amoxicilline',
                dosage: '500mg',
                frequency: '3 fois par jour',
                duration: '7 jours',
                warnings: ['Terminer le traitement même si amélioration']
            });
        } else {
            suggestions.push({
                medication: 'Azithromycine',
                dosage: '250mg',
                frequency: '1 fois par jour',
                duration: '5 jours',
                warnings: ['Alternative à la pénicilline (allergie détectée)']
            });
        }
    }

    return suggestions;
}

// Chat-like interaction with AI
export interface AIChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export async function askMedicalAI(
    question: string,
    context: {
        patient?: Patient;
        events?: MedicalEvent[];
    }
): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerQuestion = question.toLowerCase();

    // Mock responses based on question patterns
    if (lowerQuestion.includes('résumé') || lowerQuestion.includes('summary')) {
        if (context.patient) {
            const summary = await summarizePatientRecord(context.patient, context.events || []);
            return summary.summary;
        }
        return 'Veuillez sélectionner un patient pour obtenir un résumé.';
    }

    if (lowerQuestion.includes('allergie')) {
        if (context.patient?.allergies?.length) {
            return `⚠️ Le patient présente les allergies suivantes: ${context.patient.allergies.join(', ')}. Veuillez en tenir compte lors de toute prescription.`;
        }
        return 'Aucune allergie connue n\'est enregistrée pour ce patient.';
    }

    if (lowerQuestion.includes('antécédent') || lowerQuestion.includes('historique')) {
        if (context.patient?.medicalHistory?.length) {
            return `Antécédents médicaux:\n${context.patient.medicalHistory.map(h => `• ${h}`).join('\n')}`;
        }
        return 'Aucun antécédent médical notable.';
    }

    if (lowerQuestion.includes('prescription') || lowerQuestion.includes('médicament')) {
        return 'Je peux vous aider à générer une prescription. Décrivez les symptômes du patient et j\'analyserai les options thérapeutiques adaptées.';
    }

    // Default response
    return `Je suis l'assistant IA médical. Je peux vous aider à:\n• Résumer un dossier patient\n• Vérifier les allergies\n• Consulter les antécédents\n• Suggérer des prescriptions\n\nQue souhaitez-vous faire ?`;
}
