import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { useStudents } from "@/hooks/useOfflineData";
import { BarChart3, FileText, Clock, Brain, AlertTriangle, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample student data for demo
const sampleStudents = [
  { id: "1", firstName: "Ahmed", lastName: "Khalil", class: "4B", status: "warning", average: 12.5 },
  { id: "2", firstName: "Lina", lastName: "Martin", class: "5A", status: "ok", average: 16.2 },
  { id: "3", firstName: "Youssef", lastName: "Toure", class: "3C", status: "danger", average: 8.5 },
  { id: "4", firstName: "Sarah", lastName: "Dubois", class: "4B", status: "ok", average: 14.8 },
  { id: "5", firstName: "Mohamed", lastName: "Ben Ali", class: "5A", status: "warning", average: 11.2 },
  { id: "6", firstName: "Emma", lastName: "Petit", class: "3C", status: "ok", average: 15.5 },
  { id: "7", firstName: "Karim", lastName: "Hassan", class: "4A", status: "ok", average: 13.7 },
  { id: "8", firstName: "Fatima", lastName: "Zara", class: "5B", status: "warning", average: 10.8 },
];

const StudentsModule = () => {
  const [selectedStudent, setSelectedStudent] = useState<typeof sampleStudents[0] | null>(null);
  const { setSelectedItem } = usePaneContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = sampleStudents.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStudent = (student: typeof sampleStudents[0]) => {
    setSelectedStudent(student);
    setSelectedItem(student);
  };

  const tabs = selectedStudent ? [
    {
      id: "summary",
      label: "Synthèse",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{selectedStudent.average}/20</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Présence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">94%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">5/28</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "grades",
      label: "Notes",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="font-medium">Mathématiques</span>
            <span className="text-lg">14/20</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="font-medium">Français</span>
            <span className="text-lg">12/20</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="font-medium">Histoire-Géo</span>
            <span className="text-lg">15/20</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="font-medium">Sciences</span>
            <span className="text-lg">13/20</span>
          </div>
        </div>
      ),
    },
    {
      id: "attendance",
      label: "Présence",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span>Absences ce trimestre</span>
            <Badge variant="destructive">3 jours</Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span>Retards</span>
            <Badge variant="secondary">2</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Dernière absence</span>
            <span className="text-muted-foreground">15/12/2024</span>
          </div>
        </div>
      ),
    },
    {
      id: "ai",
      label: "IA Insights",
      icon: Brain,
      content: (
        <div className="space-y-4">
          {selectedStudent.status === "warning" || selectedStudent.status === "danger" ? (
            <>
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Risque détecté</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Baisse des notes en mathématiques (-3 pts) et absences répétées.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="font-medium">Recommandations</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Entretien avec les parents</li>
                  <li>• Soutien en mathématiques</li>
                  <li>• Suivi hebdomadaire</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm">Aucun risque détecté. Élève en bonne progression.</p>
            </div>
          )}
        </div>
      ),
    },
  ] : [];

  return (
    <>
      <CenterPane
        title="Élèves"
        searchPlaceholder="Rechercher un élève..."
        onSearch={setSearchQuery}
        onAdd={() => {}}
        addLabel="Nouveau"
      >
        {filteredStudents.map((student) => (
          <ListItem
            key={student.id}
            title={`${student.firstName} ${student.lastName}`}
            subtitle={`Classe ${student.class}`}
            initials={`${student.firstName[0]}${student.lastName[0]}`}
            badge={student.status === "warning" ? "⚠️" : student.status === "danger" ? "❗" : undefined}
            badgeVariant={student.status === "danger" ? "destructive" : "secondary"}
            isSelected={selectedStudent?.id === student.id}
            onClick={() => handleSelectStudent(student)}
            rightContent={
              <span className="text-xs text-muted-foreground">{student.average}/20</span>
            }
          />
        ))}
      </CenterPane>

      {selectedStudent ? (
        <DetailPane
          title={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
          subtitle={`Classe ${selectedStudent.class}`}
          tabs={tabs}
          onClose={() => {
            setSelectedStudent(null);
            setSelectedItem(null);
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Sélectionnez un élève</p>
            <p className="text-sm">pour voir son dossier complet</p>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsModule;
