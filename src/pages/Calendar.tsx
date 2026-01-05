import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export const Calendar = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Calendrier</h1>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nouvel Événement
                </button>
            </div>

            <div className="bg-white rounded-xl border p-6">
                {/* Calendrier ici */}
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Calendrier interactif à venir</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
