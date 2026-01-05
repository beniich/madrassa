# 📚 GUIDE COMPLET - TOUTES LES PAGES SCHOOLGENIUS

## 🎯 Vue d'ensemble

Ce guide contient **8 pages complètes** correspondant à chaque item de la sidebar, avec leurs fonctionnalités détaillées et code d'intégration.

---

## 📑 LISTE DES PAGES

1. **Dashboard** - Tableau de bord ✅ (Fourni)
2. **Students** - Gestion des élèves ✅ (Fourni)
3. **Teachers** - Gestion des enseignants ✅ (Fourni)
4. **Analytics** - Statistiques et rapports
5. **Calendar** - Calendrier et emploi du temps
6. **Documents** - Gestion documentaire
7. **Schedule** - Emploi du temps détaillé
8. **Messages** - Messagerie interne

---

## 1️⃣ DASHBOARD (Tableau de Bord)

### 📍 Route
```typescript
path: '/dashboard'
```

### 🎨 Composants
- **4 Cartes statistiques** avec tendances
- **6 Actions rapides** (boutons colorés)
- **2 Graphiques** (à implémenter)
- **Activité récente** (feed)

### 🔧 Fonctionnalités
```typescript
✅ Statistiques en temps réel
✅ Bouton "Scanner anomalies IA"
✅ Cartes avec progression (↑↓)
✅ Actions rapides cliquables
✅ Design responsive
```

### 💻 Code d'intégration
```typescript
// src/App.tsx
import Dashboard from '@/pages/Dashboard';

<Route path="/dashboard" element={<Dashboard />} />
```

### 📊 Données affichées
- Total élèves
- Taux de présence (%)
- Moyenne générale (/20)
- Alertes IA (nombre)

---

## 2️⃣ STUDENTS (Élèves)

### 📍 Route
```typescript
path: '/students'
```

### 🎨 Composants
- **4 Cartes statistiques** élèves
- **Tableau avec filtres** avancés
- **Recherche en temps réel**
- **Actions par ligne** (Voir/Modifier/Supprimer)

### 🔧 Fonctionnalités principales

#### Affichage
```typescript
✅ Liste complète des élèves
✅ Avatar avec initiales
✅ Badge statut (Actif/Inactif/Suspendu)
✅ Barre de progression présence
✅ Moyenne avec icône
```

#### Actions
```typescript
✅ Ajouter un élève (modal)
✅ Rechercher (nom, email)
✅ Filtrer par classe
✅ Exporter (CSV/Excel)
✅ Importer (CSV)
✅ Modifier un élève
✅ Supprimer (avec confirmation)
✅ Voir détails complets
```

#### Données par élève
```typescript
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;           // Niveau (5ème, 4ème...)
  class: string;           // Classe (5A, 5B...)
  average: number;         // Moyenne /20
  attendance: number;      // Présence en %
  status: 'active' | 'inactive' | 'suspended';
  address: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
}
```

### 💻 Code d'intégration
```typescript
import Students from '@/pages/Students';

<Route path="/students" element={<Students />} />
```

### 🎯 Use Cases
1. **Ajouter un nouvel élève** : Bouton "Nouvel Élève" → Formulaire
2. **Rechercher** : Barre de recherche → Filtrage instantané
3. **Filtrer** : Dropdown classe → Liste filtrée
4. **Exporter** : Bouton Export → Téléchargement CSV
5. **Voir détails** : Menu 3 points → "Voir détails"

---

## 3️⃣ TEACHERS (Enseignants)

### 📍 Route
```typescript
path: '/teachers'
```

### 🎨 Composants
- **4 Cartes statistiques** enseignants
- **Vue en grille (cards)**
- **Recherche et filtres**
- **Détails par carte**

### 🔧 Fonctionnalités

#### Affichage
```typescript
✅ Grille de cartes enseignants
✅ Avatar avec initiales
✅ Badge statut
✅ Informations contact
✅ Classes assignées
✅ Statistiques (élèves, heures)
```

#### Actions
```typescript
✅ Ajouter un enseignant
✅ Rechercher (nom, email, matière)
✅ Filtrer par matière
✅ Exporter la liste
✅ Modifier les informations
✅ Supprimer (avec confirmation)
✅ Voir détails complets
```

#### Données par enseignant
```typescript
interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;         // Matière enseignée
  classes: string[];       // Classes assignées
  experience: number;      // Années d'expérience
  students: number;        // Nombre d'élèves
  hoursPerWeek: number;    // Heures/semaine
  status: 'active' | 'onLeave' | 'inactive';
  hireDate: string;
}
```

### 💻 Code d'intégration
```typescript
import Teachers from '@/pages/Teachers';

<Route path="/teachers" element={<Teachers />} />
```

---

## 4️⃣ ANALYTICS (Statistiques)

### 📍 Route
```typescript
path: '/analytics'
```

### 🎨 Composants à créer
- **Graphiques de présence** (Line chart)
- **Répartition des notes** (Bar chart)
- **Évolution des effectifs** (Area chart)
- **Top/Bottom performers** (Tables)

### 🔧 Fonctionnalités
```typescript
✅ Graphiques interactifs
✅ Filtres par période
✅ Export des rapports
✅ Comparaisons annuelles
✅ Alertes automatiques
```

### 💻 Code squelette
```typescript
// src/pages/Analytics.tsx
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Statistiques</h1>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">Présence Mensuelle</h3>
          {/* Chart ici */}
        </div>
        
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">Répartition Notes</h3>
          {/* Chart ici */}
        </div>
      </div>
    </div>
  );
};
```

### 📊 Bibliothèques recommandées
```bash
npm install recharts
# ou
npm install chart.js react-chartjs-2
# ou
npm install @nivo/core @nivo/bar @nivo/line
```

---

## 5️⃣ CALENDAR (Calendrier)

### 📍 Route
```typescript
path: '/calendar'
```

### 🎨 Composants
- **Vue mensuelle** calendrier
- **Liste des événements**
- **Filtres par type**
- **Modal ajout événement**

### 🔧 Fonctionnalités
```typescript
✅ Affichage mois/semaine/jour
✅ Ajouter événement
✅ Modifier événement (drag & drop)
✅ Supprimer événement
✅ Couleurs par catégorie
✅ Rappels automatiques
```

### 💻 Code squelette
```typescript
// src/pages/Calendar.tsx
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export const Calendar = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendrier</h1>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          <Plus className="w-5 h-5 inline mr-2" />
          Nouvel Événement
        </button>
      </div>
      
      <div className="bg-white rounded-xl border p-6">
        {/* Calendrier ici */}
        <div className="h-[600px] flex items-center justify-center border-2 border-dashed">
          <p className="text-gray-400">Intégrer react-big-calendar ou FullCalendar</p>
        </div>
      </div>
    </div>
  );
};
```

### 📚 Bibliothèque recommandée
```bash
npm install react-big-calendar
npm install @types/react-big-calendar
```

---

## 6️⃣ DOCUMENTS (Gestion Documentaire)

### 📍 Route
```typescript
path: '/documents'
```

### 🎨 Composants
- **Grille de documents**
- **Upload zone** (drag & drop)
- **Prévisualisation**
- **Filtres et recherche**

### 🔧 Fonctionnalités
```typescript
✅ Upload fichiers (PDF, DOCX, images)
✅ Organiser par dossiers
✅ Recherche full-text
✅ Télécharger
✅ Partager avec permissions
✅ Versionning
```

### 💻 Code squelette
```typescript
// src/pages/Documents.tsx
import { FileText, Upload, Folder, Download } from 'lucide-react';

export const Documents = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documents</h1>
      
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Glissez-déposez vos fichiers ici</p>
        <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
          Parcourir
        </button>
      </div>
      
      {/* Liste documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Cards documents */}
      </div>
    </div>
  );
};
```

---

## 7️⃣ SCHEDULE (Emploi du Temps)

### 📍 Route
```typescript
path: '/schedule'
```

### 🎨 Composants
- **Grille horaire** (8h-18h)
- **Vue par classe**
- **Vue par enseignant**
- **Conflits automatiques**

### 🔧 Fonctionnalités
```typescript
✅ Créer cours (matière + salle + horaire)
✅ Détecter conflits
✅ Imprimer emploi du temps
✅ Exporter PDF
✅ Vue semaine/journée
```

### 💻 Code squelette
```typescript
// src/pages/Schedule.tsx
import { Clock, Calendar, Users } from 'lucide-react';

export const Schedule = () => {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Emploi du Temps</h1>
      
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Horaires</th>
              {days.map(day => (
                <th key={day} className="p-4 text-left">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map(hour => (
              <tr key={hour} className="border-b">
                <td className="p-4 font-semibold">{hour}</td>
                {days.map(day => (
                  <td key={`${hour}-${day}`} className="p-4">
                    {/* Cours ici */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 8️⃣ MESSAGES (Messagerie)

### 📍 Route
```typescript
path: '/messages'
```

### 🎨 Composants
- **Liste conversations** (sidebar)
- **Zone de chat** (centre)
- **Détails contact** (right panel)
- **Compose message**

### 🔧 Fonctionnalités
```typescript
✅ Envoyer message
✅ Répondre
✅ Pièces jointes
✅ Rechercher conversations
✅ Notifications temps réel
✅ Marquer lu/non lu
```

### 💻 Code squelette
```typescript
// src/pages/Messages.tsx
import { MessageSquare, Send, Paperclip, Search } from 'lucide-react';

export const Messages = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Liste conversations */}
      <div className="w-80 bg-white rounded-xl border flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Liste des conversations */}
        </div>
      </div>
      
      {/* Zone chat */}
      <div className="flex-1 bg-white rounded-xl border flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-bold">Nom du contact</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages */}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <input 
              type="text" 
              placeholder="Écrire un message..." 
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔗 INTÉGRATION COMPLÈTE

### App.tsx avec toutes les routes

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import Documents from '@/pages/Documents';
import Schedule from '@/pages/Schedule';
import Messages from '@/pages/Messages';
import Settings from '@/pages/Settings';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
```

---

## 📊 RÉCAPITULATIF DES FONCTIONNALITÉS

| Page | Statut | Fonctionnalités Clés | Complexité |
|------|--------|---------------------|------------|
| Dashboard | ✅ Complet | Stats, Actions, Feed | Moyenne |
| Students | ✅ Complet | CRUD, Filtres, Export | Moyenne |
| Teachers | ✅ Complet | CRUD, Cards, Stats | Moyenne |
| Analytics | 🔨 Squelette | Charts, Rapports | Élevée |
| Calendar | 🔨 Squelette | Événements, Rappels | Élevée |
| Documents | 🔨 Squelette | Upload, Folders | Moyenne |
| Schedule | 🔨 Squelette | Grille, Conflits | Élevée |
| Messages | 🔨 Squelette | Chat, Temps réel | Élevée |

---

## 🚀 ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

### Phase 1 - Base (FAIT ✅)
1. ✅ Dashboard
2. ✅ Students
3. ✅ Teachers

### Phase 2 - Intermédiaire
4. Documents (plus simple)
5. Analytics (utiliser Recharts)

### Phase 3 - Avancé
6. Calendar (react-big-calendar)
7. Schedule (complexe)
8. Messages (temps réel avec Supabase)

---

## 📦 DÉPENDANCES SUPPLÉMENTAIRES

```bash
# Pour Charts
npm install recharts

# Pour Calendar
npm install react-big-calendar moment
npm install @types/react-big-calendar

# Pour Upload
npm install react-dropzone

# Pour Real-time
# (Déjà inclus dans Supabase)
```

---

## ✅ CHECKLIST INTÉGRATION

- [ ] Toutes les routes dans App.tsx
- [ ] Tous les fichiers dans src/pages/
- [ ] Sidebar avec bons liens
- [ ] Navigation fonctionnelle
- [ ] Pas d'erreurs console
- [ ] Design cohérent partout
- [ ] Responsive sur mobile
- [ ] Loading states
- [ ] Error handling

---

**3 pages complètes fournies + 5 squelettes prêts à compléter ! 🎉**
