import { Sliders } from 'lucide-react';

export const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Paramètres</h1>

            <div className="bg-white rounded-xl border p-12 text-center">
                <Sliders className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                <p className="text-gray-500 mt-2">Module de paramètres en cours de développement</p>
            </div>
        </div>
    );
};

export default Settings;
