// ============================================================================
// PAGE ENSEIGNANTS & RH - SchoolGenius
// ============================================================================
// Fichier : src/pages/Teachers.tsx
// Persistence : Backend /api/hr
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Award,
  Users,
  X,
  Check,
  Sparkles,
  Camera,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useTeachers,
  addTeacher,
  db
} from '@/hooks/useOfflineData';
import { Teacher as DBTeacher } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

// ... (stats and cards)

// ============================================================================
// COMPOSANTS LOCAUX
// ============================================================================

const TeacherStats = ({ teachers }: { teachers: DBTeacher[] }) => {
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const totalStudents = teachers.reduce((sum, t) => sum + t.students, 0);
  const avgExperience = teachers.length > 0 ? (
    teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length
  ).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-[#222222] text-white rounded-[2rem] p-8 shadow-xl hover:translate-y-[-5px] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
            </div>
        </div>
        <p className="text-4xl font-black mb-1 tracking-tighter italic">{totalTeachers}</p>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Effectif RH Global</p>
      </div>

      <div className="bg-white text-gray-900 rounded-[2rem] p-8 shadow-xl border border-border/50 hover:translate-y-[-5px] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#222222] rounded-2xl shadow-lg shadow-black/10 group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6 text-white" />
            </div>
        </div>
        <p className="text-4xl font-black mb-1 tracking-tighter italic">{activeTeachers}</p>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Postes Opérationnels</p>
      </div>

      <div className="bg-white text-gray-900 rounded-[2rem] p-8 shadow-xl border border-border/50 hover:translate-y-[-5px] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
            </div>
        </div>
        <p className="text-4xl font-black mb-1 tracking-tighter italic">{totalStudents}</p>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Audience Étudiante</p>
      </div>

      <div className="bg-[#222222] text-white rounded-[2rem] p-8 shadow-xl hover:translate-y-[-5px] transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Award className="w-6 h-6 text-white" />
            </div>
        </div>
        <p className="text-4xl font-black mb-1 tracking-tighter italic">{avgExperience}</p>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Expérience Moyenne</p>
      </div>
    </div>
  );
};

const TeacherCard = ({
  teacher,
  onView,
  onEdit,
  onDelete,
}: {
  teacher: DBTeacher;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'onLeave': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'inactive': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <Card className="bg-white rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 p-8 group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110"></div>
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
             <div className="w-24 h-24 rounded-3xl bg-[#222222] flex items-center justify-center text-white text-3xl font-black shadow-2xl overflow-hidden border-4 border-white">
                {teacher.photo ? (
                    <img src={teacher.photo} alt="P" className="w-full h-full object-cover" />
                ) : (
                    <span className="italic">{teacher.firstName[0]}{teacher.lastName[0]}</span>
                )}
             </div>
             {teacher.status === 'active' && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg"></div>
             )}
          </div>
          <div>
            <h3 className="font-black text-2xl text-gray-900 tracking-tighter italic leading-none">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 italic">{teacher.subjects?.[0] || 'Généraliste'}</p>
            <Badge variant="outline" className={cn("mt-4 font-black text-[9px] uppercase tracking-widest px-3 py-1", getStatusBadge(teacher.status))}>
              {teacher.status === 'active' ? 'Opérationnel' : teacher.status === 'onLeave' ? 'Indisponible' : 'Inactif'}
            </Badge>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            title="Menu d'actions"
            className="p-3 bg-secondary/50 hover:bg-secondary rounded-2xl transition-all text-gray-400 hover:text-primary group/btn"
          >
            <MoreVertical className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-2">
                <button
                  onClick={() => { onView(teacher.localId); setShowMenu(false); }}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-secondary rounded-2xl w-full text-left font-black text-xs uppercase tracking-widest text-gray-900 transition-colors"
                >
                  <Eye className="w-4 h-4 text-primary" /> Visualiser
                </button>
                <button
                  onClick={() => { onEdit(teacher.localId); setShowMenu(false); }}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-secondary rounded-2xl w-full text-left font-black text-xs uppercase tracking-widest text-gray-900 transition-colors"
                >
                  <Edit className="w-4 h-4 text-primary" /> Édition RH
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                <button
                  onClick={() => { onDelete(teacher.localId); setShowMenu(false); }}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-rose-50 rounded-2xl w-full text-left font-black text-xs uppercase tracking-widest text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8 relative z-10">
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-3xl border border-white/50">
          <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Mail className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[11px] font-black text-gray-600 truncate uppercase tracking-tighter">{teacher.email}</span>
        </div>
        <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-3xl border border-white/50">
          <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Phone className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[11px] font-black text-gray-600 uppercase tracking-tighter">{teacher.phone}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-2 bg-[#222222] rounded-[2rem] border-4 border-white shadow-inner relative z-10">
        <div className="py-4 text-center">
          <p className="text-2xl font-black text-primary italic leading-none">{teacher.students}</p>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter mt-1">Impact</p>
        </div>
        <div className="py-4 text-center border-x border-white/10">
          <p className="text-2xl font-black text-white italic leading-none">{teacher.classIds?.length || 0}</p>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter mt-1">Groupes</p>
        </div>
        <div className="py-4 text-center">
          <p className="text-2xl font-black text-primary italic leading-none">{teacher.experience}</p>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter mt-1">Années</p>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Teachers = () => {
  const { user } = useAuth();
  const teachers = useTeachers() || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<DBTeacher>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: ['Mathématiques'],
    classIds: ['Général'],
    experience: 0,
    students: 0,
    hoursPerWeek: 18,
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0],
    photo: undefined
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = filterSubject === 'all' || teacher.subjects.includes(filterSubject);
    return matchesSearch && matchesSubject;
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subjects: ['Mathématiques'],
      classIds: ['Général'],
      experience: 0,
      students: 0,
      hoursPerWeek: 18,
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
      photo: undefined
    });
    setShowModal(true);
  };

  const handleOpenEdit = (id: string) => {
    const t = teachers.find(x => x.localId === id);
    if (!t) return;
    setIsEditing(true);
    setCurrentId(id);
    setFormData({ ...t });
    setShowModal(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          toast.error("Image trop volumineuse (max 2MB)");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.schoolId) return;
    try {
      if (isEditing && currentId) {
        await db.teachers.where('localId').equals(currentId).modify(formData);
        toast.success("Profil RH mis à jour");
      } else {
        await addTeacher({
          schoolId: user.schoolId,
          firstName: formData.firstName || '',
          lastName: formData.lastName || '',
          email: formData.email || '',
          phone: formData.phone || '',
          subjects: formData.subjects || ['Mathématiques'],
          classIds: formData.classIds || ['Général'],
          experience: formData.experience || 0,
          students: formData.students || 0,
          hoursPerWeek: formData.hoursPerWeek || 18,
          status: (formData.status as any) || 'active',
          hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
          photo: formData.photo
        });
        toast.success("Nouveau dossier RH créé", { icon: <Sparkles className="h-4 w-4" /> });
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Erreur d'enregistrement");
    }
  };

  const handleDelete = (id: string) => {
    toast.error("Confirmer la suppression ?", {
      action: {
        label: "Supprimer",
        onClick: async () => {
          const t = teachers.find(x => x.localId === id);
          if (t && t.id) {
            await db.teachers.delete(t.id);
            toast.success("Dossier supprimé");
          }
        }
      }
    });
  };

  return (
    <div className="space-y-10 relative pb-20">
      {/* Modal Formulaire RH */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
           <Card className="rounded-[3rem] border-none shadow-2xl max-w-3xl w-full p-10 md:p-14 bg-white flex flex-col md:flex-row gap-12 animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh]">
              {/* Photo Section */}
              <div className="flex flex-col items-center space-y-6 md:border-r md:border-secondary md:pr-12">
                 <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                    <div className="w-40 h-40 rounded-[2.5rem] bg-secondary flex items-center justify-center text-gray-400 border-4 border-dashed border-primary/20 group-hover:bg-primary/5 group-hover:border-primary transition-all overflow-hidden shadow-inner">
                       {formData.photo ? (
                           <img src={formData.photo} alt="P" className="w-full h-full object-cover" />
                       ) : (
                           <Camera className="w-12 h-12" />
                       )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/20 backdrop-blur-sm transition-all rounded-[2.5rem]">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest shadow-lg">Modifier Photo</span>
                    </div>
                    <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} title="Capture" />
                 </div>
                 <div className="text-center">
                    <Badge className="bg-[#222222] text-white font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">Identifiant RH</Badge>
                 </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-4xl font-black italic tracking-tighter text-gray-900">{isEditing ? 'Édition RH' : 'Recrutement RH'}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Dossier Académique Sécurisé</p>
                    </div>
                    <button onClick={() => setShowModal(false)} title="Fermer" className="h-12 w-12 bg-secondary/50 hover:bg-secondary rounded-2xl flex items-center justify-center text-gray-900 transition-all"><X className="w-5 h-5" /></button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="fname">Prénom</label>
                            <Input id="fname" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="h-12 rounded-2xl bg-secondary/30 border-none font-bold italic focus:ring-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="lname">Nom de famille</label>
                            <Input id="lname" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="h-12 rounded-2xl bg-secondary/30 border-none font-bold italic focus:ring-primary/20" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="email-input">Email Institutionnel</label>
                        <Input id="email-input" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 rounded-2xl bg-secondary/30 border-none font-bold focus:ring-primary/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="subject-input">Spécialisation</label>
                            <select id="subject-input" value={formData.subjects?.[0] || 'Mathématiques'} onChange={(e) => setFormData({...formData, subjects: [e.target.value]})} title="Spécialité" className="w-full h-12 px-5 rounded-2xl bg-secondary/30 border-none font-bold outline-none appearance-none italic focus:ring-2 focus:ring-primary/20">
                                <option value="Mathématiques">MATHÉMATIQUES</option>
                                <option value="Français">FRANÇAIS</option>
                                <option value="Histoire-Géographie">HISTOIRE-GÉO</option>
                                <option value="Anglais">ANGLAIS</option>
                                <option value="Physique-Chimie">PHYSIQUE-CHIMIE</option>
                                <option value="SVT">SVT</option>
                                <option value="Sport">ÉDUCATION PHYSIQUE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1" htmlFor="status-input">Affectation</label>
                            <select id="status-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'onLeave' | 'inactive'})} title="Statut" className="w-full h-12 px-5 rounded-2xl bg-secondary/30 border-none font-bold outline-none appearance-none italic focus:ring-2 focus:ring-primary/20">
                                <option value="active">OPÉRATIONNEL</option>
                                <option value="onLeave">CONGÉ</option>
                                <option value="inactive">INACTIF / ARCHIVÉ</option>
                            </select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-16 bg-[#222222] hover:bg-black text-white rounded-[2rem] font-black mt-6 shadow-2xl shadow-black/20 transition-all active:scale-95 group">
                        {isEditing ? 'SYNCHRONISER LE DOSSIER' : 'INTÉGRER AU SYSTÈME RH'} <Check className="ml-3 w-6 h-6 group-hover:scale-110 transition-transform text-primary" />
                    </Button>
                 </form>
              </div>
           </Card>
        </div>
      )}

      {/* Header Premium */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#222222] p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group">
            <GraduationCap className="h-32 w-32 -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
        </div>
        <div className="relative z-10 space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.4em] px-5 py-1.5 rounded-full">
                SECTION RH & ENSEIGNEMENT
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none">Registre du <span className="text-primary italic">Corps Ensaignant</span></h1>
            <p className="text-gray-400 font-medium text-sm max-w-md leading-relaxed">
               Gestion souveraine des ressources humaines et suivi des affectations pédagogiques.
            </p>
        </div>
        <div className="flex gap-4 relative z-10">
            <Button onClick={handleOpenAdd} className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black shadow-2xl shadow-primary/20 gap-4 group transition-all active:scale-95">
                <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" /> NOUVEL AGENT
            </Button>
        </div>
      </div>

      {!teachers ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6">
              <div className="h-20 w-20 relative">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Synchronisation RH...</p>
          </div>
      ) : (
          <>
            <TeacherStats teachers={teachers} />

            {/* Filtres Bar */}
            <div className="bg-white p-6 rounded-[3rem] shadow-xl flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <Input 
                        placeholder="Filtrer par nom, spécialisation ou email institutionnel..." 
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
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        title="Sélecteur"
                        className="bg-transparent font-black px-4 text-[11px] uppercase tracking-widest border-none outline-none h-12 w-48 cursor-pointer italic text-gray-600 focus:text-primary transition-colors"
                    >
                        <option value="all">CORPS GLOBAL</option>
                        <option value="Mathématiques">MATHÉMATIQUES</option>
                        <option value="Français">FRANÇAIS</option>
                        <option value="Histoire-Géographie">HISTOIRE-GÉO</option>
                        <option value="Anglais">ANGLAIS</option>
                        <option value="Physique-Chimie">SCIENCES</option>
                    </select>
                </div>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredTeachers.map((teacher) => (
                    <TeacherCard
                        key={teacher.localId}
                        teacher={teacher}
                        onView={(id) => toast.info(`Dossier Académique #${id} ouvert`)}
                        onEdit={handleOpenEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {filteredTeachers.length === 0 && (
                <div className="flex flex-col items-center justify-center p-32 opacity-20 bg-secondary/30 rounded-[4rem] border-4 border-dashed border-gray-200">
                    <GraduationCap className="h-32 w-32 mb-6" />
                    <p className="text-2xl font-black italic uppercase tracking-tighter">Aucun dossier RH correspondant</p>
                </div>
            )}
          </>
      )}
    </div>
  );
};

export default Teachers;
