import { Clock, Calendar, Users } from 'lucide-react';

export const Schedule = () => {
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Emploi du Temps</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Par classe</button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Par enseignant</button>
                </div>
            </div>

            <div className="bg-white rounded-xl border overflow-x-auto shadow-sm">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-left font-semibold text-gray-600 w-24">Horaires</th>
                            {days.map(day => (
                                <th key={day} className="p-4 text-left font-semibold text-gray-900">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map(hour => (
                            <tr key={hour} className="border-b last:border-0 hover:bg-gray-50/50">
                                <td className="p-4 font-medium text-gray-500 border-r">{hour}</td>
                                {days.map(day => (
                                    <td key={`${hour}-${day}`} className="p-2 border-r last:border-0 h-24 align-top">
                                        {/* Placeholder for course */}
                                        {Math.random() > 0.8 && (
                                            <div className="bg-purple-100 border-l-4 border-purple-500 p-2 rounded text-sm">
                                                <p className="font-semibold text-purple-900">Mathématiques</p>
                                                <p className="text-xs text-purple-700">Salle 101 - 5A</p>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Schedule;
