import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export const Analytics = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Statistiques</h1>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-bold mb-4">Présence Mensuelle</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <span className="text-gray-400">Graphique de présence</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-bold mb-4">Répartition Notes</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <span className="text-gray-400">Graphique des notes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
