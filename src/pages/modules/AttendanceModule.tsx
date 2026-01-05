import { useState } from "react";
import CenterPane from "@/components/dashboard/CenterPane";
import DetailPane from "@/components/dashboard/DetailPane";
import ListItem from "@/components/dashboard/ListItem";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, AlertTriangle, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const sampleClasses = [
  { id: "1", name: "4B", date: "Aujourd'hui", present: 25, absent: 2, late: 1 },
  { id: "2", name: "5A", date: "Aujourd'hui", present: 28, absent: 0, late: 2 },
  { id: "3", name: "3C", date: "Aujourd'hui", present: 24, absent: 3, late: 0 },
  { id: "4", name: "4A", date: "Hier", present: 29, absent: 1, late: 0 },
  { id: "5", name: "5B", date: "Hier", present: 26, absent: 1, late: 2 },
];

const sampleStudents = [
  { id: "1", name: "Ahmed Khalil", status: "absent", justified: false },
  { id: "2", name: "Lina Martin", status: "present", justified: false },
  { id: "3", name: "Youssef Toure", status: "late", justified: true },
  { id: "4", name: "Sarah Dubois", status: "present", justified: false },
  { id: "5", name: "Mohamed Ben Ali", status: "absent", justified: true },
  { id: "6", name: "Emma Petit", status: "present", justified: false },
  { id: "7", name: "Karim Hassan", status: "present", justified: false },
  { id: "8", name: "Fatima Zara", status: "present", justified: false },
];

const AttendanceModule = () => {
  const [selectedClass, setSelectedClass] = useState<typeof sampleClasses[0] | null>(null);
  const { setSelectedItem } = usePaneContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(sampleStudents.map(s => [s.id, s.status]))
  );

  const filteredClasses = sampleClasses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClass = (cls: typeof sampleClasses[0]) => {
    setSelectedClass(cls);
    setSelectedItem(cls);
  };

  const cycleStatus = (studentId: string) => {
    const current = attendance[studentId];
    const next = current === "present" ? "absent" : current === "absent" ? "late" : "present";
    setAttendance(prev => ({ ...prev, [studentId]: next }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-success" />;
      case "absent":
        return <X className="h-4 w-4 text-destructive" />;
      case "late":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const tabs = selectedClass ? [
    {
      id: "attendance",
      label: "Appel",
      icon: Users,
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
            <span>Cliquez pour modifier le statut</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-success" /> Présent</span>
              <span className="flex items-center gap-1"><X className="h-3 w-3 text-destructive" /> Absent</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-warning" /> Retard</span>
            </div>
          </div>
          {sampleStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => cycleStatus(student.id)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                attendance[student.id] === "absent" && "border-destructive/30 bg-destructive/5",
                attendance[student.id] === "late" && "border-warning/30 bg-warning/5",
                attendance[student.id] === "present" && "border-success/30 bg-success/5"
              )}
            >
              <span className="font-medium">{student.name}</span>
              <div className="flex items-center gap-2">
                {student.justified && attendance[student.id] !== "present" && (
                  <Badge variant="outline" className="text-xs">Justifié</Badge>
                )}
                {getStatusIcon(attendance[student.id])}
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "history",
      label: "Historique",
      icon: Calendar,
      content: (
        <div className="text-center text-muted-foreground py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>L'historique des présences sera affiché ici</p>
        </div>
      ),
    },
  ] : [];

  return (
    <>
      <CenterPane
        title="Présence"
        searchPlaceholder="Rechercher une classe..."
        onSearch={setSearchQuery}
      >
        {filteredClasses.map((cls) => (
          <ListItem
            key={cls.id}
            title={`Classe ${cls.name}`}
            subtitle={cls.date}
            icon={<Users className="h-4 w-4 text-primary" />}
            isSelected={selectedClass?.id === cls.id}
            onClick={() => handleSelectClass(cls)}
            rightContent={
              <div className="flex items-center gap-2">
                {cls.absent > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {cls.absent} abs
                  </Badge>
                )}
                {cls.late > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {cls.late} ret
                  </Badge>
                )}
              </div>
            }
          />
        ))}
      </CenterPane>

      {selectedClass ? (
        <DetailPane
          title={`Présence - Classe ${selectedClass.name}`}
          subtitle={selectedClass.date}
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
            <p className="text-sm">pour faire l'appel</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceModule;
