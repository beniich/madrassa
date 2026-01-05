import { useState } from "react";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, BookOpen, GraduationCap, School } from "lucide-react";

const sampleClasses = [
  { id: "1", name: "3A", level: "3ème", students: 28, mainTeacher: "M. Martin", average: 13.2 },
  { id: "2", name: "3B", level: "3ème", students: 26, mainTeacher: "Mme Bernard", average: 12.8 },
  { id: "3", name: "3C", level: "3ème", students: 27, mainTeacher: "M. Leroy", average: 11.5 },
  { id: "4", name: "4A", level: "4ème", students: 30, mainTeacher: "Mme Dupont", average: 14.1 },
  { id: "5", name: "4B", level: "4ème", students: 28, mainTeacher: "M. Moreau", average: 13.7 },
  { id: "6", name: "5A", level: "5ème", students: 29, mainTeacher: "Mme Petit", average: 14.5 },
  { id: "7", name: "5B", level: "5ème", students: 27, mainTeacher: "M. Dubois", average: 13.9 },
];

const ClassesModule = () => {
  const [selectedClass, setSelectedClass] = useState<typeof sampleClasses[0] | null>(null);
  const { setSelectedItem } = usePaneContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = sampleClasses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClass = (cls: typeof sampleClasses[0]) => {
    setSelectedClass(cls);
    setSelectedItem(cls);
  };

  const tabs = selectedClass ? [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Élèves</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{selectedClass.students}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{selectedClass.average}/20</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Présence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">95%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "students",
      label: "Élèves",
      icon: Users,
      content: (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b">
              <span>Élève {i + 1}</span>
              <Badge variant="outline">{12 + i}/20</Badge>
            </div>
          ))}
          <p className="text-sm text-muted-foreground text-center pt-4">
            + {selectedClass.students - 5} autres élèves
          </p>
        </div>
      ),
    },
    {
      id: "subjects",
      label: "Matières",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          {["Mathématiques", "Français", "Histoire-Géo", "Anglais", "Sciences"].map((subject) => (
            <div key={subject} className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">{subject}</span>
              <span className="text-sm text-muted-foreground">3h/semaine</span>
            </div>
          ))}
        </div>
      ),
    },
  ] : [];

  return (
    <>
      <CenterPane
        title="Classes"
        searchPlaceholder="Rechercher une classe..."
        onSearch={setSearchQuery}
        onAdd={() => {}}
        addLabel="Nouvelle"
      >
        {filteredClasses.map((cls) => (
          <ListItem
            key={cls.id}
            title={`Classe ${cls.name}`}
            subtitle={`${cls.level} • ${cls.mainTeacher}`}
            icon={<School className="h-4 w-4 text-primary" />}
            isSelected={selectedClass?.id === cls.id}
            onClick={() => handleSelectClass(cls)}
            rightContent={
              <Badge variant="outline">{cls.students}</Badge>
            }
          />
        ))}
      </CenterPane>

      {selectedClass ? (
        <DetailPane
          title={`Classe ${selectedClass.name}`}
          subtitle={`${selectedClass.level} • ${selectedClass.mainTeacher}`}
          tabs={tabs}
          onClose={() => {
            setSelectedClass(null);
            setSelectedItem(null);
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Sélectionnez une classe</p>
            <p className="text-sm">pour voir les détails</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassesModule;
