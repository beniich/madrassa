import DetailPane from "@/components/dashboard/DetailPane";
import { Calendar } from "lucide-react";

const TimetableModule = () => {
  return (
    <DetailPane title="Emploi du temps" subtitle="Semaine du 16 au 20 décembre 2024">
      <div className="text-center text-muted-foreground py-16">
        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Emploi du temps</p>
        <p className="text-sm">Le planning sera affiché ici</p>
      </div>
    </DetailPane>
  );
};

export default TimetableModule;
