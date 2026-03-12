// ============================================================================
// PAGE DOCUMENTS - SchoolGenius
// ============================================================================
// Fichier : src/pages/Documents.tsx
// ============================================================================

import { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Folder as FolderIcon,
  Download,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share2,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  X,
  Plus,
  Grid,
  List,
  Filter,
  ArrowUpRight,
  HardDrive,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


// ============================================================================
// TYPES
// ============================================================================

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'excel' | 'other';
  size: number;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  sharedWith: string[];
  url?: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  documentCount: number;
}

// ============================================================================
// DONNÉES DE DÉMONSTRATION
// ============================================================================

const DEMO_FOLDERS: Folder[] = [
  { id: '1', name: 'Examens', color: 'from-rose-500 to-red-600', documentCount: 12 },
  { id: '2', name: 'Cours', color: 'from-blue-500 to-indigo-600', documentCount: 45 },
  { id: '3', name: 'Administratif', color: 'from-emerald-500 to-teal-600', documentCount: 23 },
  { id: '4', name: 'Rapports', color: 'from-purple-500 to-purple-800', documentCount: 8 },
  { id: '5', name: 'Photos', color: 'from-amber-500 to-orange-600', documentCount: 156 },
];

const DEMO_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Examen_Math_5A_2026.pdf',
    type: 'pdf',
    size: 2458000,
    folder: 'Examens',
    uploadedBy: 'Sophie Laurent',
    uploadedAt: '2026-01-05T10:30:00',
    sharedWith: ['Enseignants', 'Direction'],
  },
  {
    id: '2',
    name: 'Cours_Histoire_Chapitre3.docx',
    type: 'doc',
    size: 1245000,
    folder: 'Cours',
    uploadedBy: 'Thomas Dubois',
    uploadedAt: '2026-01-04T14:20:00',
    sharedWith: ['Classe 5A'],
  },
  {
    id: '3',
    name: 'Rapport_Trimestriel_Q1.xlsx',
    type: 'excel',
    size: 856000,
    folder: 'Rapports',
    uploadedBy: 'Admin',
    uploadedAt: '2026-01-03T09:15:00',
    sharedWith: ['Direction'],
  },
  {
    id: '4',
    name: 'Photo_Sortie_Scolaire.jpg',
    type: 'image',
    size: 3245000,
    folder: 'Photos',
    uploadedBy: 'Marie Petit',
    uploadedAt: '2026-01-02T16:45:00',
    sharedWith: ['Tous'],
  },
];

// ... utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="w-8 h-8 text-rose-500" />;
    case 'doc': return <FileText className="w-8 h-8 text-blue-500" />;
    case 'image': return <ImageIcon className="w-8 h-8 text-emerald-500" />;
    case 'excel': return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    default: return <File className="w-8 h-8 text-gray-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'À l\'instant';
  if (hours < 24) return `Il y a ${hours}h`;
  if (hours < 48) return 'Hier';
  return date.toLocaleDateString('fr-FR');
};

// ============================================================================
// COMPOSANT CARD DOCUMENT
// ============================================================================

const DocumentCard = ({
  doc,
  onView,
  onEdit,
  onDelete,
  onShare,
  onDownload,
}: {
  doc: Document;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onDownload: (id: string) => void;
}) => {
  return (
    <Card className="group bg-white rounded-[2rem] border-none shadow-lg hover:shadow-2xl hover:translate-y-[-5px] transition-all duration-500 p-6 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                title="Options"
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={(e) => { e.stopPropagation(); toast.info("Options avancées...") }}
            >
                <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
        </div>
      
        <div className="h-32 mb-6 flex items-center justify-center bg-gray-50 rounded-3xl group-hover:scale-105 transition-transform duration-500">
            {getFileIcon(doc.type)}
        </div>

        <div className="space-y-1 mb-6">
            <h4 className="font-black text-gray-900 text-sm truncate italic italic tracking-tight">{doc.name}</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                {formatFileSize(doc.size)} • {doc.type.toUpperCase()}
            </p>
        </div>

        <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDate(doc.uploadedAt)}</span>
                <span className="text-gray-900 italic">#{doc.folder}</span>
            </div>
            
            <div className="flex gap-2">
                <Button 
                    title="Visualiser"
                    variant="ghost" 
                    className="flex-1 h-10 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-600 font-black text-[10px] uppercase tracking-widest p-0"
                    onClick={() => onView(doc.id)}
                >
                    VOIR
                </Button>
                <Button 
                    title="Télécharger"
                    className="flex-1 h-10 rounded-xl bg-gray-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest p-0"
                    onClick={() => onDownload(doc.id)}
                >
                    DL
                </Button>
            </div>
        </div>
    </Card>
  );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

export const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(DEMO_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleDownload = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) toast.success(`Téléchargement de ${doc.name} initié...`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        toast.success("Synchronisation Cloud terminée (Simulation)");
        setShowUpload(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" title="Parcourir" />

      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <FolderIcon className="h-24 w-24 -rotate-12" />
        </div>
        <div className="relative z-10 space-y-2">
            <Badge className="bg-purple-50 text-purple-600 border-purple-100 font-black text-[9px] uppercase tracking-[0.2em] px-3 mb-2">
                MEDIATHÈQUE CLOUD
            </Badge>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Espace Documents</h1>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                Archives, ressources pédagogiques et documents administratifs
            </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
            <Button
                onClick={() => setShowUpload(true)}
                title="Déposer un nouveau fichier"
                className="h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl shadow-purple-100 gap-3 group"
            >
                <Upload className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" /> IMPORTER
            </Button>
            <Button
                variant="outline"
                title="Plus d'actions"
                className="h-14 w-14 rounded-2xl border-gray-100 p-0 hover:bg-gray-50"
            >
                <MoreVertical className="h-6 w-6 text-gray-400" />
            </Button>
        </div>
      </div>

      {/* Stats Drive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Documents Total', val: documents.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Espace Utilisé', val: '12.4 GB', icon: HardDrive, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Vitesse Sync', val: '450 Mbps', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Partages Actifs', val: '28', icon: Share2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-none shadow-md bg-white hover:shadow-xl transition-all">
             <div className="flex justify-between items-center mb-1">
                <div className={cn("p-2 rounded-xl", stat.bg, stat.color)}>
                    <stat.icon className="h-5 w-5" />
                </div>
                <div className="h-1 w-12 bg-gray-100 rounded-full"></div>
             </div>
             <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.val}</p>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Dossiers Grid */}
      <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-900 italic tracking-tight flex items-center gap-3">
                <FolderIcon className="h-5 w-5 text-purple-600" /> Vos Dossiers
            </h3>
            <Button variant="ghost" className="text-[10px] font-black text-purple-600 p-0 hover:bg-transparent h-auto italic flex items-center gap-1">
                TOUT VOIR <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Card 
                onClick={() => setSelectedFolder('all')}
                className={cn(
                    "cursor-pointer group rounded-[2rem] border-none p-6 transition-all duration-300 relative overflow-hidden",
                    selectedFolder === 'all' 
                        ? "bg-gray-900 text-white shadow-2xl shadow-gray-400 scale-105" 
                        : "bg-white text-gray-900 shadow-md hover:shadow-xl border border-gray-50 hover:translate-y-[-5px]"
                )}
            >
                <FolderIcon className={cn("h-8 w-8 mb-4 transition-transform group-hover:scale-110", selectedFolder === 'all' ? "text-white" : "text-gray-400")} />
                <p className="font-black italic text-sm tracking-tight mb-1">Tous</p>
                <p className={cn("text-[9px] font-black uppercase tracking-widest", selectedFolder === 'all' ? "text-gray-400" : "text-gray-400")}>{documents.length} OBJETS</p>
            </Card>

            {DEMO_FOLDERS.map((folder) => (
               <Card 
                key={folder.id}
                onClick={() => setSelectedFolder(folder.name)}
                className={cn(
                    "cursor-pointer group rounded-[2.2rem] border-none p-6 transition-all duration-300 relative overflow-hidden",
                    selectedFolder === folder.name 
                        ? "bg-purple-600 text-white shadow-2xl shadow-purple-200 scale-105" 
                        : "bg-white text-gray-900 shadow-md hover:shadow-xl border border-gray-50 hover:translate-y-[-5px]"
                )}
            >
                <div className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg",
                    selectedFolder === folder.name ? "bg-white/20" : "bg-gray-50"
                )}>
                    <FolderIcon className={cn("h-5 w-5", selectedFolder === folder.name ? "text-white" : "text-gray-400")} />
                </div>
                <p className="font-black italic text-sm tracking-tight mb-1 truncate">{folder.name}</p>
                <p className={cn("text-[9px] font-black uppercase tracking-widest", selectedFolder === folder.name ? "text-purple-100" : "text-gray-400")}>{folder.documentCount} DOCS</p>
                {selectedFolder === folder.name && <div className="absolute top-0 right-0 p-4"><div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div></div>}
            </Card>
            ))}
            
            <button 
                title="Nouveau Dossier"
                className="rounded-[2.2rem] border-2 border-dashed border-gray-100 p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-50/50 hover:border-purple-200 transition-all text-gray-300 hover:text-purple-500"
            >
                <Plus className="h-8 w-8" />
                <span className="text-[10px] font-black uppercase tracking-widest">Créer</span>
            </button>
          </div>
      </div>

      {/* Explorer Tools */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center mt-12">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <Input 
                placeholder="Filtrer les documents par nom ou type..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-14 bg-gray-50/50 border-none rounded-[1.5rem] font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" title="Vue grille" className={cn("h-12 w-12 rounded-2xl", viewMode === 'grid' ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50")} onClick={() => setViewMode('grid')}>
                <Grid className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" title="Vue liste" className={cn("h-12 w-12 rounded-2xl", viewMode === 'list' ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50")} onClick={() => setViewMode('list')}>
                <List className="h-5 w-5" />
             </Button>
          </div>
      </div>

      {/* Content Grid */}
      {filteredDocuments.length > 0 ? (
        <div className={cn(
            viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' 
                : 'space-y-4'
        )}>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={(id) => toast.info(`Aperçu du document #${id}`)}
              onEdit={() => {}}
              onDelete={() => {}}
              onShare={() => {}}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 max-w-2xl mx-auto w-full">
            <FileText className="h-24 w-24 text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 italic tracking-tight mb-2">Drive Introuvable</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm leading-relaxed px-6">
                Aucun document ne correspond à vos critères de filtrage. Essayez de réinitialiser la vue ou de changer de dossier.
            </p>
            <Button variant="outline" className="mt-8 rounded-2xl border-gray-100 font-black text-[10px] uppercase tracking-widest px-8" onClick={() => { setSelectedFolder('all'); setSearchQuery(''); }}>
                VOIR TOUT
            </Button>
        </div>
      )}

      {/* Upload Modal (Premium Animation) */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <Card className="rounded-[3rem] border-none shadow-2xl max-w-xl w-full p-12 bg-white animate-in zoom-in-95 duration-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] active">
                    <Upload className="h-64 w-64 text-gray-900" />
                </div>
                
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 italic tracking-tight">Déposer un fichier</h3>
                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mt-2">Cloud Synchro Enabled</p>
                        </div>
                        <button onClick={() => setShowUpload(false)} title="Fermer" className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                            <X className="h-6 w-6 text-gray-400" />
                        </button>
                    </div>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-[2.5rem] p-16 text-center group hover:border-purple-200 transition-all cursor-pointer"
                    >
                        <div className="h-20 w-20 bg-white rounded-[1.5rem] shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-gray-900 font-black italic text-lg mb-2">Glissez & Déposez</p>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[200px] mx-auto">
                            OU cliquez pour parcourir vos fichiers (Max 250MB par unité)
                        </p>
                    </div>

                    <div className="flex gap-4 p-5 bg-blue-50 rounded-3xl items-center border border-blue-100">
                        <div className="p-2 bg-blue-500 rounded-xl text-white">
                            <Zap className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest leading-relaxed">
                            L'IA trie automatiquement vos fichiers importés dans les dossiers correspondants.
                        </p>
                    </div>
                </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default Documents;
