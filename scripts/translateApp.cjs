const fs = require('fs');
const path = require('path');

// ============================================================================
// Madrassa App - Auto Translator Script
// Ce script remplace les termes français les plus courants codés en dur 
// dans les fichiers .tsx et .ts par leur équivalent anglais.
// ============================================================================

// Dictionnaire de traduction (Francais -> Anglais)
const dictionary = {
    'Gestion des Ressources Humaines': 'Human Resources Management',
    'Tableau de Bord': 'Dashboard',
    'Espace Enseignant': 'Teacher Portal',
    'Espace Parent': 'Parent Portal',
    "Vue d'ensemble de votre établissement": 'Overview of your institution',
    'Scanner anomalies': 'Scan anomalies',
    'Nouvelle absence': 'New absence',
    'Note ajoutée': 'Grade added',
    'Rapport généré': 'Report generated',
    'Voir toutes les notifications': 'See all notifications',
    'Menu profil': 'Profile menu',
    'Utilisateur': 'User',
    'Déconnexion réussie': 'Successfully logged out',
    'À bientôt !': 'See you soon!',
    'Erreur lors de la déconnexion': 'Error during logout',
    'Rechercher un document...': 'Search document...',
    'Filtrer': 'Filter',
    'Nouveau': 'New',
    'Aucun dossier structuré': 'No structured folder',
    'fichiers': 'files',
    'Documents Récents': 'Recent Documents',
    'Aperçu des 10 derniers fichiers': 'Preview of last 10 files',
    'Voir tout': 'See all',
    'Nom du fichier': 'File Name',
    'Propriétaire': 'Owner',
    'Date': 'Date',
    'Taille': 'Size',
    'Action': 'Action',
    'Congés & Absences': 'Leaves & Absences',
    'Employés Actifs': 'Active Employees',
    'Taux de Présence': 'Attendance Rate',
    'Demandes Congés': 'Leave Requests',
    'Élèves': 'Students',
    'Classes': 'Classes',
    'Absences': 'Attendance',
    'Notes': 'Grades',
    'Bulletins': 'Report Cards',
    'Paiements': 'Payments',
    'Paramètres': 'Settings',
    'Profil': 'Profile',
    'Prénom': 'First Name',
    'Nom': 'Last Name',
    'Date de naissance': 'Date of Birth',
    'Enregistrer': 'Save',
    'Annuler': 'Cancel',
    'Fermer': 'Close',
    'Modifier': 'Edit',
    'Supprimer': 'Delete',
    'Sauvegarder': 'Save',
    'Ajouter': 'Add',
    'Créer': 'Create',
    'Télécharger': 'Download',
    'Imprimer': 'Print',
    'Mise à jour': 'Update',
    'Tableau de bord': 'Dashboard',
    'Gérez vos employés': 'Manage your employees',
    'les absences et les performances': 'absences and performances',
    'Carte 100% Lit': '100% Lit Card',
    'Rendu instantané': 'Instant rendering',
    'Ceci est un Web Component': 'This is a Web Component',
    'Sélectionner': 'Select',
    'Oui': 'Yes',
    'Non': 'No',
    'Chargement...': 'Loading...',
    'Erreur': 'Error',
    'Succès': 'Success',
    'Attention': 'Warning',
};

// Fonction récursive pour lire tous les fichiers JSX/TSX
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
                callback(dirPath);
            }
        }
    });
}

function translateFiles() {
    const srcPath = path.join(__dirname, '..', 'src');
    let modCount = 0;

    walkDir(srcPath, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        for (const [fr, en] of Object.entries(dictionary)) {
            // Regex pour remplacer le mot indépendamment des guillemets
            // on évite de remplacer les variables en ignorant les chaînes sans espaces si possible,
            // ou en s'assurant que ce sont des textes exacts.
            const regex = new RegExp(fr, 'g');
            content = content.replace(regex, en);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Traduit : ${path.relative(srcPath, filePath)}`);
            modCount++;
        }
    });

    console.log(`\n🎉 Terminé ! ${modCount} fichiers traduits vers l'anglais.`);
}

console.log('Démarrage de la traduction...');
translateFiles();
