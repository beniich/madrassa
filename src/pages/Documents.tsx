import { useState } from "react";
import { useDocuments } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    File,
    Upload,
    Search,
    Folder,
    Download,
    MoreVertical,
    FileText,
    Image as ImageIcon,
    FileArchive,
    Loader2,
    Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DocumentsPage = () => {
    const documents = useDocuments();
    const [searchTerm, setSearchTerm] = useState("");

    const categories = [
        { name: "Rapports", icon: FileText, count: 5, color: "text-blue-500" },
        { name: "Syllabus", icon: Folder, count: 12, color: "text-amber-500" },
        { name: "Administratif", icon: File, count: 8, color: "text-green-500" },
        { name: "Archives", icon: FileArchive, count: 3, color: "text-purple-500" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestion des Documents</h1>
                    <p className="text-muted-foreground">Espace de stockage sécurisé pour les ressources et archives</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Upload className="h-4 w-4" />
                    Déposer un fichier
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <Card key={cat.name} className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center", cat.color)}>
                                <cat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">{cat.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-semibold">{cat.count} fichiers</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom de fichier..."
                            className="pl-10 pb-1"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm divide-y">
                    {documents === undefined ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                                <File className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">Aucun document trouvé</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">Commencez par téléverser des ressources ou des bulletins (.pdf, .doc, .xlsx).</p>
                            </div>
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.localId} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                        {doc.type === 'report' ? <FileText className="h-5 w-5" /> : <File className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{doc.name}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            {doc.category} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                            <Badge variant="outline" className="text-[9px] py-0">{doc.syncStatus}</Badge>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" title="Télécharger"><Download className="h-4 w-4 text-muted-foreground" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Mock Entries if empty for visualization */}
                    {documents?.length === 0 && (
                        <>
                            <div className="p-4 flex items-center justify-between text-muted-foreground/50 grayscale italic">
                                <div className="flex items-center gap-4">
                                    <FileText className="h-10 w-10 opacity-20" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Exemple_Rapport_Trimestriel.pdf</h4>
                                        <p className="text-xs">Exemple de donnée locale</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
