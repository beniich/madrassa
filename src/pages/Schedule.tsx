import { TimetableView } from "@/components/timetable/TimetableView";

export const Schedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emploi du Temps</h1>
          <p className="text-gray-600 mt-1">
            Gérez les cours et horaires de l'établissement
          </p>
        </div>
      </div>
      <TimetableView />
    </div>
  );
};

export default Schedule;
