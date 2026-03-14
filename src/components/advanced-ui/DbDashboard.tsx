import React, { useState } from 'react';
import { useAuditLogs, useRunCronJob, useFlashback } from '../../hooks/useDbFeatures';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Database, Clock, Shield, History, Search } from "lucide-react";
import { toast } from "sonner";

export default function DbDashboard() {
  const { data: logs, isLoading: isLoadingLogs, error: errorLogs } = useAuditLogs();
  const runCron = useRunCronJob();
  
  // Flashback state
  const [fbTable, setFbTable] = useState('orders');
  const [fbId, setFbId] = useState('');
  const [fbAt, setFbAt] = useState('');
  const [triggerFb, setTriggerFb] = useState<Date | null>(null);

  const { data: fbData, isLoading: isLoadingFb, error: errorFb } = useFlashback(
    fbTable, 
    fbId, 
    triggerFb
  );

  const handleRunJob = async (jobName: string) => {
    try {
      await runCron.mutateAsync(jobName);
      toast.success(`Job ${jobName} exécuté avec succès`);
    } catch (e) {
      toast.error(`Erreur lors de l'exécution du job ${jobName}`);
    }
  };

  const handleFlashbackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTable || !fbId || !fbAt) {
      toast.error("Veuillez remplir tous les champs Flashback");
      return;
    }
    setTriggerFb(new Date(fbAt));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Système de Base de Données Avancé</h1>
          <p className="text-muted-foreground">Audit, Flashback, Tâches planifiées et Statistiques.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Backend Connecté
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Unifié</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Actif</div>
            <p className="text-xs text-muted-foreground">Triggers PostgreSQL en fonction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Redis</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connecté</div>
            <p className="text-xs text-muted-foreground">Latence &lt; 5ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduler (Jobs)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">1 Job en attente</div>
            <Button 
              size="sm" 
              onClick={() => handleRunJob('daily-cleanup')}
              disabled={runCron.isPending}
            >
              {runCron.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Forcer Nettoyage
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="audit" className="flex gap-2">
            <Shield className="h-4 w-4" /> Journaux d'Audit
          </TabsTrigger>
          <TabsTrigger value="flashback" className="flex gap-2">
            <History className="h-4 w-4" /> Flashback Viewer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journaux d'Audit (Audit Logs)</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : errorLogs ? (
                <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md">
                  Erreur lors de la récupération des logs. Le serveur backend est-il lancé ?
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>ID Ligne</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun log trouvé dans la base de données.
                        </TableCell>
                      </TableRow>
                    )}
                    {logs && logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs font-mono">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs">{log.user_id}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            log.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-xs">{log.table_name}</TableCell>
                        <TableCell className="font-mono text-[10px] truncate max-w-[120px]">
                          {log.row_id}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voyage Temporel (Flashback)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Reconstituez l'état d'une ligne de données à n'importe quel moment passé.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleFlashbackSearch} className="grid gap-4 md:grid-cols-4 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Table</label>
                  <Input 
                    value={fbTable} 
                    onChange={(e) => setFbTable(e.target.value)} 
                    placeholder="orders"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">ID Ligne</label>
                  <Input 
                    value={fbId} 
                    onChange={(e) => setFbId(e.target.value)} 
                    placeholder="UUID..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase text-muted-foreground">Date & Heure (AS OF)</label>
                  <Input 
                    type="datetime-local" 
                    value={fbAt} 
                    onChange={(e) => setFbAt(e.target.value)} 
                  />
                </div>
                <Button type="submit" disabled={isLoadingFb}>
                  {isLoadingFb ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Voyager
                </Button>
              </form>

              {fbData && (
                <div className="mt-6 space-y-4 border rounded-lg p-6 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="font-semibold text-lg flex gap-2 items-center">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Snapshot au {new Date(fbAt).toLocaleString()}
                    </h3>
                    <Badge>AS OF</Badge>
                  </div>
                  <pre className="text-xs font-mono overflow-auto max-h-[400px] p-4 bg-white dark:bg-black rounded border">
                    {JSON.stringify(fbData.snapshot, null, 2)}
                  </pre>
                </div>
              )}

              {!fbData && triggerFb && !isLoadingFb && (
                <div className="mt-6 border-dashed border-2 rounded-lg p-12 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Aucun historique trouvé pour cet ID à cette date précise.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input bg-background"
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
}
