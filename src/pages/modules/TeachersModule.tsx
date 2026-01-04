import { useState } from "react";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, BookOpen, Calendar, Users } from "lucide-react";

const sampleTeachers = [
  { id: "1", firstName: "Marie", lastName: "Dupont", subject: "Mathématiques", classes: ["4A", "4B", "5A"], hours: 18 },
  { id: "2", firstName: "Jean", lastName: "Martin", subject: "Français", classes: ["3A", "3B", "4A"], hours: 16 },
  { id: "3", firstName: "Sophie", lastName: "Bernard", subject: "Histoire-Géo", classes: ["5A", "5B"], hours: 14 },
  { id: "4", firstName: "Pierre", lastName: "Leroy", subject: "Sciences", classes: ["3C", "4B", "5B"], hours: 18 },
  { id: "5", firstName: "Claire", lastName: "Moreau", subject: "Anglais", classes: ["4A", "4B", "5A", "5B"], hours: 20 },
];

const TeachersModule = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<typeof sampleTeachers[0] | null>(null);
  const { setSelectedItem } = usePaneContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = sampleTeachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTeacher = (teacher: typeof sampleTeachers[0]) => {
    setSelectedTeacher(teacher);
    setSelectedItem(teacher);
  };

  const tabs = selectedTeacher ? [
    {
      id: "info",
      label: "Informations",
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Matière</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{selectedTeacher.subject}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Heures/semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{selectedTeacher.hours}h</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "classes",
      label: "Classes",
      icon: Users,
      content: (
        <div className="space-y-4">
          {selectedTeacher.classes.map((cls) => (
            <div key={cls} className="flex items-center justify-between py-3 border-b">
              <span className="font-medium">Classe {cls}</span>
              <Badge variant="outline">28 élèves</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "schedule",
      label: "Emploi du temps",
      icon: Calendar,
      content: (
        <div className="text-center text-muted-foreground py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>L'emploi du temps sera affiché ici</p>
        </div>
      ),
    },
  ] : [];

  return (
    <>
      <CenterPane
        title="Enseignants"
        searchPlaceholder="Rechercher un enseignant..."
        onSearch={setSearchQuery}
        onAdd={() => {}}
        addLabel="Nouveau"
      >
        {filteredTeachers.map((teacher) => (
          <ListItem
            key={teacher.id}
            title={`${teacher.firstName} ${teacher.lastName}`}
            subtitle={teacher.subject}
            initials={`${teacher.firstName[0]}${teacher.lastName[0]}`}
            isSelected={selectedTeacher?.id === teacher.id}
            onClick={() => handleSelectTeacher(teacher)}
            rightContent={
              <span className="text-xs text-muted-foreground">{teacher.hours}h</span>
            }
          />
        ))}
      </CenterPane>

      {selectedTeacher ? (
        <DetailPane
          title={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
          subtitle={selectedTeacher.subject}
          tabs={tabs}
          onClose={() => {
            setSelectedTeacher(null);
            setSelectedItem(null);
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Sélectionnez un enseignant</p>
            <p className="text-sm">pour voir son profil complet</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TeachersModule;
