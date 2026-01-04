import { useState, useEffect } from "react";
import {
  Folder,
  FileText,
  ChevronRight,
  Search,
  Plus,
  Upload,
  MoreVertical,
  Share2,
  Download,
  LayoutGrid,
  List as ListIcon,
  Clock,
  HardDrive,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documentsService } from "@/services/documentsService";
import { SchoolFile, SchoolFolder } from "@/types/school-365";
import { cn } from "@/lib/utils";

const DocumentsModule = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<SchoolFolder[]>([]);
  const [files, setFiles] = useState<SchoolFile[]>([]);
  const [path, setPath] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Mes Fichiers' }]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const f = await documentsService.getFolders(currentFolderId);
      setFolders(f);
      if (currentFolderId) {
        const fi = await documentsService.getFiles(currentFolderId);
        setFiles(fi);
      } else {
        setFiles([]);
      }
    };
    fetchData();
  }, [currentFolderId]);

  const navigateToFolder = (folder: SchoolFolder) => {
    setCurrentFolderId(folder.id);
    setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const goBack = () => {
    if (path.length > 1) {
      const newPath = [...path];
      newPath.pop();
      const last = newPath[newPath.length - 1];
      setPath(newPath);
      setCurrentFolderId(last.id);
    }
  };

  const jumpToPath = (index: number) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
    setCurrentFolderId(newPath[index].id);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xlsx': return <FileSpreadsheet className="text-green-600" />;
      case 'pdf': return <FileText className="text-red-500" />;
      case 'jpg':
      case 'png': return <FileImage className="text-blue-400" />;
      default: return <FileIcon className="text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Action Bar (Office 365 style) */}
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700 border-none gap-2 font-semibold shadow-sm">
            <Plus size={18} />
            Nouveau
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400">
            <Upload size={18} />
            Charger
          </Button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-slate-600 dark:text-slate-400">
            <Download size={18} />
            Tout télécharger
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Rechercher..."
              className="pl-9 w-64 h-9 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs Navigation */}
      <div className="px-6 py-3 flex items-center gap-1 text-sm text-slate-500 bg-white/50 dark:bg-slate-900/50 border-b border-border shrink-0">
        <button
          onClick={goBack}
          disabled={path.length <= 1}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        {path.map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} />}
            <button
              onClick={() => jumpToPath(i)}
              className={cn(
                "px-2 py-1 rounded-md transition-colors",
                i === path.length - 1 ? "font-bold text-slate-900 dark:text-white" : "hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
            >
              {p.name}
            </button>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Folder size={12} />
                Dossiers
              </h3>
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
              )}>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => navigateToFolder(folder)}
                    className={cn(
                      "group flex items-center gap-4 p-3 rounded-xl border bg-white dark:bg-slate-900 transition-all hover:shadow-md hover:border-blue-300",
                      viewMode === 'grid' ? "flex-col text-center" : "flex-row text-left"
                    )}
                  >
                    <div className={cn(
                      "rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      viewMode === 'grid' ? "w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500" : "w-10 h-10 bg-blue-50/50 dark:bg-blue-900/20 text-blue-500"
                    )}>
                      <Folder size={viewMode === 'grid' ? 32 : 20} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{folder.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{folder.itemCount} éléments</p>
                    </div>
                    {viewMode === 'list' && <MoreVertical size={16} className="text-slate-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {(files.length > 0 || folders.length === 0) && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} />
                Récent
              </h3>
              <div className={cn(
                "grid gap-2",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {files.length > 0 ? (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "group p-3 rounded-xl border bg-white dark:bg-slate-900 flex transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500/10",
                        viewMode === 'grid' ? "flex-col" : "flex-row items-center gap-4"
                      )}
                    >
                      <div className={cn(
                        "rounded-lg flex items-center justify-center shrink-0 mb-3",
                        viewMode === 'grid' ? "w-full aspect-video bg-slate-50 dark:bg-slate-800" : "w-10 h-10 bg-slate-50 dark:bg-slate-800"
                      )}>
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate text-slate-800 dark:text-slate-200">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">{file.type}</span>
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                        viewMode === 'grid' ? "mt-3 pt-3 border-t border-slate-50" : ""
                      )}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <Share2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : folders.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-4 bg-white/30 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                      <HardDrive size={40} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-500">Ce dossier est vide</p>
                      <p className="text-sm text-slate-400">Glissez-déposez des fichiers pour les charger</p>
                    </div>
                    <Button variant="outline" className="border-blue-200 text-blue-600 bg-white">
                      Charger un fichier
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Storage Footer Info */}
      <div className="h-10 px-6 border-t border-border bg-white dark:bg-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-blue-500" />
            </div>
            <span>6.5 GB sur 10 GB utilisés</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">245 dossiers • 1,240 fichiers</span>
        </div>
        <div className="flex items-center gap-2 text-blue-500 cursor-pointer hover:underline">
          Mettre à niveau le stockage
        </div>
      </div>
    </div>
  );
};

export default DocumentsModule;
