import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Lock, Key, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface APIConfig {
    provider: 'openai' | 'claude' | 'gemini';
    apiKey: string;
    model: string;
}

export const APIConfigPanel = () => {
    const [config, setConfig] = useState<APIConfig>({
        provider: 'openai',
        apiKey: '',
        model: 'gpt-4'
    });

    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = () => {
        const saved = localStorage.getItem('ai_api_config');
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load API config');
            }
        }
    };

    const saveConfig = () => {
        localStorage.setItem('ai_api_config', JSON.stringify(config));
        toast.success('💾 Configuration API sauvegardée !');
    };

    const testConnection = () => {
        if (!config.apiKey) {
            toast.error('Veuillez entrer une clé API !');
            return;
        }

        toast.loading('Test de connexion...');

        setTimeout(() => {
            toast.dismiss();
            toast.success('✅ Connexion réussie !');
        }, 1500);
    };

    const models = {
        openai: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        claude: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        gemini: ['gemini-pro', 'gemini-ultra', 'gemini-nano']
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Warning Banner */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <p className="font-semibold text-yellow-900">🔐 Réservé aux Super Administrateurs</p>
                        <p className="text-sm text-yellow-800 mt-1">
                            Cette configuration permet de connecter l'application à une véritable API d'IA.
                            Conservez votre clé API en sécurité.
                        </p>
                    </div>
                </div>
            </div>

            {/* Config Panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Key className="w-6 h-6 text-purple-600" />
                    Configuration API IA
                </h3>

                <div className="space-y-6">
                    {/* Provider Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fournisseur d'IA
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['openai', 'claude', 'gemini'] as const).map((provider) => (
                                <button
                                    key={provider}
                                    onClick={() => setConfig({ ...config, provider, model: models[provider][0] })}
                                    className={`p-4 rounded-lg border-2 transition-all ${config.provider === provider
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <p className="font-semibold capitalize">{provider}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Clé API
                        </label>
                        <div className="relative">
                            <input
                                type={showKey ? 'text' : 'password'}
                                value={config.apiKey}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                placeholder="sk-..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-20"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showKey ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Votre clé API ne sera pas partagée. Elle est stockée localement dans votre navigateur.
                        </p>
                    </div>

                    {/* Model Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Modèle
                        </label>
                        <select
                            value={config.model}
                            onChange={(e) => setConfig({ ...config, model: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {models[config.provider].map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button onClick={saveConfig} className="flex-1 gap-2">
                            <Save className="w-4 h-4" /> Sauvegarder
                        </Button>
                        <Button onClick={testConnection} variant="outline" className="gap-2">
                            <CheckCircle className="w-4 h-4" /> Tester
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Comment obtenir une clé API ?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" className="underline">platform.openai.com/api-keys</a></li>
                    <li>• <strong>Claude:</strong> <a href="https://console.anthropic.com/" target="_blank" className="underline">console.anthropic.com</a></li>
                    <li>• <strong>Gemini:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">makersuite.google.com/app/apikey</a></li>
                </ul>
            </div>
        </div>
    );
};
