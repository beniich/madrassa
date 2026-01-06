// ============================================================================
// PAGE DOCUMENTS - SchoolGenius
// ============================================================================
// Fichier : src/pages/Documents.tsx
// ============================================================================

import { useState } from 'react';
import {
  FileText,
  Upload,
  Folder,
  Download,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share2,
  File,
  Image,
  FileSpreadsheet,
  FileCode,
  X,
  Plus,
  Grid,
  List,
  Filter,
} from 'lucide-react';

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
  { id: '1', name: 'Examens', color: 'bg-red-500', documentCount: 12 },
  { id: '2', name: 'Cours', color: 'bg-blue-500', documentCount: 45 },
  { id: '3', name: 'Administratif', color: 'bg-green-500', documentCount: 23 },
  { id: '4', name: 'Rapports', color: 'bg-purple-500', documentCount: 8 },
  { id: '5', name: 'Photos', color: 'bg-yellow-500', documentCount: 156 },
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

// ============================================================================
// UTILITAIRES
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-8 h-8 text-red-500" />;
    case 'doc':
      return <FileText className="w-8 h-8 text-blue-500" />;
    case 'image':
      return <Image className="w-8 h-8 text-green-500" />;
    case 'excel':
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    default:
      return <File className="w-8 h-8 text-gray-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Il y a moins d\'une heure';
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
}: {
  doc: Document;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getFileIcon(doc.type)}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {doc.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(doc.size)}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <button
                  onClick={() => {
                    onView(doc.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  Visualiser
                </button>
                <button
                  onClick={() => {
                    onShare(doc.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm"
                >
                  <Share2 className="w-4 h-4 text-green-600" />
                  Partager
                </button>
                <button
                  onClick={() => {
                    onEdit(doc.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm"
                >
                  <Edit className="w-4 h-4 text-purple-600" />
                  Renommer
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm">
                  <Download className="w-4 h-4 text-gray-600" />
                  Télécharger
                </button>
                <button
                  onClick={() => {
                    onDelete(doc.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm border-t"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Folder className="w-3 h-3" />
          <span>{doc.folder}</span>
        </div>
        <div>
          <span>Par {doc.uploadedBy}</span>
        </div>
        <div>
          <span>{formatDate(doc.uploadedAt)}</span>
        </div>
      </div>

      {doc.sharedWith.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Partagé avec {doc.sharedWith.length} groupe(s)
            </span>
          </div>
        </div>
      )}
    </div>
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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === 'all' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleView = (id: string) => {
    alert(`Visualiser document ${id}`);
  };

  const handleEdit = (id: string) => {
    alert(`Renommer document ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce document ?')) {
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  const handleShare = (id: string) => {
    alert(`Partager document ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Gérez tous vos fichiers et documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Importer
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">
            {documents.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Documents</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">
            {DEMO_FOLDERS.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Dossiers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">
            {formatFileSize(
              documents.reduce((sum, doc) => sum + doc.size, 0)
            )}
          </p>
          <p className="text-sm text-gray-600 mt-1">Espace utilisé</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-900">50 GB</p>
          <p className="text-sm text-gray-600 mt-1">Espace total</p>
        </div>
      </div>

      {/* Dossiers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Dossiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => setSelectedFolder('all')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedFolder === 'all'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Folder className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="font-semibold text-sm text-gray-900">Tous</p>
            <p className="text-xs text-gray-500 mt-1">
              {documents.length} docs
            </p>
          </button>
          {DEMO_FOLDERS.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFolder === folder.name
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Folder className={`w-8 h-8 mx-auto mb-2 ${folder.color.replace('bg-', 'text-')}`} />
              <p className="font-semibold text-sm text-gray-900">
                {folder.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {folder.documentCount} docs
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-50 border-purple-500 text-purple-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg border transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-50 border-purple-500 text-purple-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Liste/Grille de documents */}
      {filteredDocuments.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
              : 'space-y-2'
          }
        >
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Aucun document trouvé</p>
          <p className="text-sm text-gray-500 mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}

      {/* Zone d'upload (Modal) */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Importer un fichier
              </h3>
              <button
                onClick={() => setShowUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou cliquez pour parcourir
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Sélectionner des fichiers
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Formats supportés : PDF, DOCX, XLSX, images (max. 50 MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
