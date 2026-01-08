import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    BarElement, Title
);

export const AnalyticsDashboard = () => {
    // Doughnut Chart Data
    const doughnutData = {
        labels: ['Tableurs', 'Lettres', 'Présentations'],
        datasets: [{
            data: [42, 89, 25],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
            borderWidth: 0
        }]
    };

    // Line Chart Data
    const lineData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
            label: 'Documents créés',
            data: [12, 19, 15, 22, 18, 8, 14],
            borderColor: '#9333ea',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    // Bar Chart Data
    const barData = {
        labels: ['GPT-4', 'Claude 3', 'Gemini Pro'],
        datasets: [{
            label: 'Utilisations',
            data: [85, 52, 19],
            backgroundColor: ['#9333ea', '#ec4899', '#3b82f6']
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* AI Panel */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-2">📈 Analytics IA - Vue d'ensemble</h3>
                <p className="opacity-90">Analysez vos documents avec l'intelligence artificielle</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">156</h3>
                    <p className="opacity-90 mt-1">Documents créés</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">42</h3>
                    <p className="opacity-90 mt-1">Tableurs générés</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">89</h3>
                    <p className="opacity-90 mt-1">Lettres rédigées</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center shadow-xl">
                    <h3 className="text-4xl font-bold">25</h3>
                    <p className="opacity-90 mt-1">Présentations</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">📊 Utilisation par type</h4>
                    <div className="h-[300px]">
                        <Doughnut data={doughnutData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">📈 Documents créés (7 jours)</h4>
                    <div className="h-[300px]">
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                <h4 className="font-semibold text-gray-900 mb-4">🤖 Modèles IA utilisés</h4>
                <div className="h-[300px]">
                    <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
                </div>
            </div>
        </div>
    );
};
