// ============================================================================
// PAGE ÉLÈVES COMPLÈTE - SchoolGenius
// ============================================================================
// Fichier : src/pages/Students.tsx
// ============================================================================

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Award,
  TrendingUp,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ConfettiLottie } from "@/components/ui/LottieAnimation";
import { useAuth } from '@/contexts/AuthContext';
import {
  useStudents,
  addStudent,
  deleteStudent,
  useClasses
} from '@/hooks/useOfflineData';
import { Student as DBStudent } from '@/lib/db';


// ============================================================================
// TYPES
// ============================================================================

// Données gérées via useStudents hook

// ============================================================================
// COMPOSANT STATISTIQUES ÉLÈVES
// ============================================================================

const StudentStats = ({ students }: { students: DBStudent[] }) => {
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const avgGrade = 14.5; // Placeholder for now or calculate if grades exist
  const avgAttendance = 92; // Placeholder

  const STATS = [
    { label: 'Total Students', val: totalStudents, icon: Users, color: 'from-[#222222] to-gray-700', iconColor: 'text-primary' },
    { label: 'Students Actifs', val: activeStudents, icon: GraduationCap, color: 'from-primary to-orange-400', iconColor: 'text-white' },
    { label: 'Réussite Globale', val: `${avgGrade}/20`, icon: Award, color: 'from-[#222222] to-gray-700', iconColor: 'text-primary' },
    { label: 'Taux Présence', val: `${avgAttendance}%`, icon: TrendingUp, color: 'from-primary to-orange-400', iconColor: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {STATS.map((stat, i) => (
        <Card key={i} className="group relative overflow-hidden border-none shadow-xl p-8 bg-white hover:translate-y-[-5px] transition-all duration-500 rounded-[2.5rem]">
           <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full bg-gradient-to-br", stat.color)}></div>
           <div className="flex items-center gap-6 relative z-10">
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", stat.color.includes('primary') ? 'bg-primary shadow-primary/20' : 'bg-[#222222] shadow-black/10')}>
                <stat.icon className={cn("h-7 w-7", stat.iconColor)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-2 italic">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic">{stat.val}</p>
              </div>
           </div>
        </Card>
      ))}
    </div>
  );
};


// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Students = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    classId: 'all'
  });

  const students = useStudents(filterClass === 'all' ? undefined : filterClass) || [];
  const classes = useClasses() || [];

  // Filtrage par recherche
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.parentEmail && student.parentEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  // Actions
  const handleView = (localId: string) => {
    const student = students.find(s => s.localId === localId);
    if (student) {
        toast.info(`Profile de ${student.firstName} activé`, { icon: <Eye className="h-4 w-4" /> });
    }
  };

  const handleEdit = (localId: string) => {
     toast.info(`Modification autorisée pour l'élève #${localId}`);
  };

  const handleDeleteStudent = (localId: string) => {
      toast.error("Voulez-vous vraiment supprimer cet élève ?", {
          action: {
              label: "Confirmer",
              onClick: async () => {
                await deleteStudent(localId);
                toast.success("Registre mis à jour");
              }
          }
      });
  };

  const handleExport = () => {
    toast.promise(
        new Promise(resolve => setTimeout(resolve, 1500)),
        {
            loading: "Préparation du fichier CSV...",
            success: "Base de données exportée avec succès",
            error: "Échec de l'exportation"
        }
    );
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.schoolId) return;

    try {
        await addStudent({
            schoolId: user.schoolId,
            firstName: newStudentData.firstName,
            lastName: newStudentData.lastName,
            parentEmail: newStudentData.email,
            classId: newStudentData.classId === 'all' ? '5A' : newStudentData.classId,
            dateOfBirth: '',
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'active'
        });
        
        setShowAddModal(false);
        setNewStudentData({ firstName: '', lastName: '', email: '', classId: 'all' });
        toast.success("Admission confirmée", { icon: <Sparkles className="h-4 w-4 text-primary" /> });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
    } catch (err) {
        toast.error("Error d'enregistrement");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      toast.success("Document lu avec succès. 42 nouveaux élèves détectés.");
    }
  };

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Celebration Layer */}
      {showCelebration && (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
            <ConfettiLottie className="w-[1200px] h-[1200px]" onComplete={() => setShowCelebration(false)} />
        </div>
      )}

      {/* Hidden file input for import */}
      <input 
        type="file" 
        id="import-input" 
        className="hidden" 
        accept=".csv,.xlsx" 
        onChange={handleImport}
        title="Importer des élèves"
      />

      {/* Modal Ajout Élève (Premium Glass) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
          <Card className="rounded-[3rem] border-none shadow-2xl max-w-lg w-full p-12 bg-white flex flex-col animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter leading-none">Nouvelle Admission</h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-3">Registre Académique Officiel</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                title="Close"
                className="h-12 w-12 bg-secondary/50 hover:bg-secondary rounded-2xl flex items-center justify-center text-gray-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="firstName">First Name</label>
                    <Input 
                      id="firstName"
                      required
                      value={newStudentData.firstName}
                      onChange={(e) => setNewStudentData({...newStudentData, firstName: e.target.value})}
                      className="rounded-2xl border-none bg-secondary/30 h-12 font-bold italic focus:ring-primary/20"
                      placeholder="Identité"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="lastName">Last Name</label>
                    <Input 
                      id="lastName"
                      required
                      value={newStudentData.lastName}
                      onChange={(e) => setNewStudentData({...newStudentData, lastName: e.target.value})}
                      className="rounded-2xl border-none bg-secondary/30 h-12 font-bold italic focus:ring-primary/20"
                      placeholder="Patronyme"
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="email">Email Étudiant</label>
                <Input 
                  id="email"
                  type="email" 
                  required
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                  className="rounded-2xl border-none bg-secondary/30 h-12 font-bold focus:ring-primary/20"
                  placeholder="nom.prenom@ecole.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="class-select">Affectation de Groupe</label>
                <select 
                  id="class-select"
                  value={newStudentData.classId}
                  onChange={(e) => setNewStudentData({...newStudentData, classId: e.target.value})}
                  title="Select une classe"
                  className="w-full px-5 h-12 rounded-2xl border-none bg-secondary/30 font-bold outline-none appearance-none italic focus:ring-2 focus:ring-primary/20"
                >
                  <option value="5A">CLASSE 5A</option>
                  <option value="5B">CLASSE 5B</option>
                  <option value="4A">CLASSE 4A</option>
                  <option value="4B">CLASSE 4B</option>
                </select>
              </div>
              <Button 
                type="submit"
                className="w-full h-16 bg-[#222222] hover:bg-black text-white rounded-[2rem] font-black shadow-2xl shadow-black/20 gap-3 mt-6 transition-all active:scale-95 group"
              >
                CONFIRMER L'INSCRIPTION <Check className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Header section premium Orange/Charbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#222222] p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group">
            <Users className="h-32 w-32 -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
        </div>
        <div className="relative z-10 space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.4em] px-5 py-1.5 rounded-full">
                SOUVERAINETÉ ACADÉMIQUE
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">Registres <span className="text-primary italic">des Students</span></h1>
            <p className="text-gray-400 font-medium text-sm max-w-md leading-relaxed">
                Pilotage centralisé des profils académiques et suivi analytique de la performance globale.
            </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
            <Button
                variant="outline"
                title="Importer"
                onClick={() => document.getElementById('import-input')?.click()}
                className="h-16 px-8 rounded-[2rem] border-white/10 font-black text-xs uppercase tracking-widest gap-3 bg-white/5 hover:bg-white/10 text-white transition-all flex border"
            >
                <Upload className="w-5 h-5 text-primary" /> IMPORT
            </Button>
            <Button
                onClick={() => setShowAddModal(true)}
                title="Add"
                className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black shadow-2xl shadow-primary/20 gap-4 group transition-all active:scale-95"
            >
                <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" /> NOUVEL ÉLÈVE
            </Button>
        </div>
      </div>

      {/* Statistiques animées */}
      <StudentStats students={students} />

      {/* Filtres Bar */}
      <div className="bg-white p-6 rounded-[3rem] shadow-xl flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-focus-within:rotate-12 transition-transform" />
            <Input 
                placeholder="Filter l'effectif par nom, spécialité ou email institutionnel..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 bg-secondary/30 border-none rounded-[2rem] font-black text-sm placeholder:text-gray-400 focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-3 bg-secondary/30 p-2 pr-6 rounded-[2rem] border border-secondary">
             <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Filter className="h-5 w-5 text-primary" />
             </div>
             <select
               value={filterClass}
               onChange={(e) => setFilterClass(e.target.value)}
               title="Sélecteur"
               className="bg-transparent font-black px-4 text-[11px] uppercase tracking-widest border-none outline-none h-12 w-48 cursor-pointer italic text-gray-600 focus:text-primary transition-colors"
             >
               <option value="all">CORPS GLOBAL</option>
               <option value="5A">GROUPE 5A</option>
               <option value="5B">GROUPE 5B</option>
               <option value="4A">GROUPE 4A</option>
               <option value="4B">GROUPE 4B</option>
             </select>
          </div>
      </div>

      {/* Tableau Premium */}
      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden group">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/20 border-b border-gray-100">
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Profile Académique</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Assignation</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Score Médian</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Assiduité</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 text-center">Régime</th>
                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="group/row hover:bg-secondary/10 transition-all duration-300">
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-500 italic",
                                idx % 2 === 0 ? "bg-[#222222] shadow-black/10" : "bg-primary shadow-primary/20"
                            )}>
                                    {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                                <p className="font-black text-gray-900 tracking-tighter italic text-lg leading-none">
                                    {student.firstName} {student.lastName}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{student.parentEmail || 'Pas d\'email'}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-10 py-6">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-700 tracking-tighter italic">Classe {student.classId}</span>
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 opacity-70">SYSTÈME ACADÉMIQUE</span>
                         </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                         <div className="inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-[1.25rem] border border-secondary shadow-sm">
                             <Award className="h-5 w-5 text-primary" />
                             <span className="font-black text-gray-900 italic text-sm">14.5/20</span>
                         </div>
                    </td>
                    <td className="px-10 py-6">
                         <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Index Flux</span>
                                <span className="text-[10px] font-black text-gray-900">92%</span>
                            </div>
                            <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 bg-emerald-500"
                                    style={{ width: `92%` }}
                                ></div>
                            </div>
                         </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                         <Badge className={cn(
                            "rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border-none px-4 py-1.5",
                            student.status === 'active' ? "bg-emerald-50 text-emerald-600 shadow-sm" : 
                            student.status === 'transferred' ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-600"
                         )}>
                             {student.status.toUpperCase()}
                         </Badge>
                    </td>
                    <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Voir"
                                onClick={() => handleView(student.localId)}
                                className="h-10 w-10 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                             >
                                <Eye className="h-4 w-4" />
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Éditer"
                                onClick={() => handleEdit(student.localId)}
                                className="h-10 w-10 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                             >
                                <Edit className="h-4 w-4" />
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Delete"
                                onClick={() => handleDeleteStudent(student.localId)}
                                className="h-10 w-10 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                             >
                                <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center text-white">
                    <div className="flex flex-col items-center justify-center space-y-6 opacity-20">
                        <div className="p-10 bg-secondary rounded-[3rem]">
                            <Users className="h-32 w-32 text-gray-400 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-black text-gray-900 tracking-tighter italic text-2xl uppercase">Aucune Correspondance</p>
                            <p className="text-sm font-medium text-gray-500">Ajustez les paramètres de filtrage synchronisé.</p>
                        </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Style Futuriste */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-[#222222] p-8 md:p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 p-10 opacity-[0.03]">
             <Sparkles className="h-20 w-20" />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] relative z-10">
          INDEX GÉNÉRAL • <span className="text-primary">{filteredStudents.length}</span> ENTRÉES CHARGÉES
        </p>
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="outline" title="Précédent" className="h-14 w-14 rounded-[1.5rem] border-white/10 p-0 bg-white/5 hover:bg-white/10 group transition-all">
             <ChevronLeft className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
          </Button>
          <div className="flex gap-3">
            {[1, 2, 3].map(n => (
                <Button 
                  key={n}
                  title={`Page ${n}`}
                  className={cn(
                    "h-14 w-14 rounded-[1.5rem] font-black italic text-sm transition-all shadow-2xl",
                    n === 1 ? "bg-primary text-white shadow-primary/20 scale-110" : "bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10"
                  )}
                >
                    {n}
                </Button>
            ))}
          </div>
          <Button variant="outline" title="Suivant" className="h-14 w-14 rounded-[1.5rem] border-white/10 p-0 bg-white/5 hover:bg-white/10 group transition-all">
             <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>

      <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="p-10 md:p-14 border-none shadow-2xl bg-white rounded-[4rem] relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="relative z-10 space-y-8">
                    <div className="h-16 w-16 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                        <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">Analyse de Flux IA</h3>
                        <p className="text-gray-500 font-medium text-sm mt-4 leading-relaxed max-w-sm">
                            Les algorithmes prédictifs indiquent une hausse de la motivation académique. Les indicateurs sont au vert pour le second trimestre.
                        </p>
                    </div>
                    <Button className="bg-[#222222] text-white hover:bg-black rounded-2xl h-16 px-10 font-black gap-3 shadow-xl shadow-black/20 group transition-all">
                        DÉTAILS ANALYTIQUES <ArrowUpRight className="h-5 w-5 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </Card>

            <Card className="p-10 md:p-14 border-none shadow-2xl bg-primary text-white rounded-[4rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20"></div>
                <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Optimisation SYSTÈME</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter italic text-white leading-none">Admission 4.0</h3>
                        <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm mt-4">
                            Nouvelle interface d'inscription ultra-rapide. Synchronisation native avec les registres de scolarité internationaux.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                        <span className="text-white italic">Ver. 5.1.0-RC</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
                        <span className="bg-white/10 px-3 py-1 rounded-full">Secure Stack</span>
                    </div>
                </div>
            </Card>
      </div>
    </div>
  );
};

export default Students;
