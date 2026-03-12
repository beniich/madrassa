import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpreadsheetAI } from '@/components/ai-documents/SpreadsheetAI';
import { LetterAI } from '@/components/ai-documents/LetterAI';
import { PresentationAI } from '@/components/ai-documents/PresentationAI';
import { AnalyticsDashboard } from '@/components/ai-documents/AnalyticsDashboard';
import { APIConfigPanel } from '@/components/ai-documents/APIConfigPanel';
import { Bot, Sparkles } from 'lucide-react';

export const AIDocuments = () => {
    const [aiActive] = useState(true);

    // Check if user is superadmin (placeholder - replace with actual role check)
    const isSuperAdmin = true; // TODO: Replace with actual role check

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 10px,
                            rgba(255,255,255,0.1) 10px,
                            rgba(255,255,255,0.1) 20px
                        )`,
                        animation: 'slide 20s linear infinite'
                    }} />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Bot className="w-10 h-10" />
                            <h1 className="text-4xl font-bold">
                                AI Documents
                            </h1>
                            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                POWERED BY AI
                            </span>
                        </div>
                        <p className="text-lg opacity-90">
                            Créez des documents intelligents avec l'intelligence artificielle
                        </p>
                    </div>

                    {aiActive && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full border border-white/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm font-semibold">IA Active</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="spreadsheet" className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger
                        value="spreadsheet"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
                    >
                        📊 Tableur AI
                    </TabsTrigger>
                    <TabsTrigger
                        value="letters"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
                    >
                        📝 Lettres AI
                    </TabsTrigger>
                    <TabsTrigger
                        value="presentations"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
                    >
                        🎤 Présentations AI
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
                    >
                        📈 Analytics AI
                    </TabsTrigger>
                    {isSuperAdmin && (
                        <TabsTrigger
                            value="api-config"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all"
                        >
                            🔐 API Config
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="spreadsheet" className="mt-6">
                    <SpreadsheetAI />
                </TabsContent>

                <TabsContent value="letters" className="mt-6">
                    <LetterAI />
                </TabsContent>

                <TabsContent value="presentations" className="mt-6">
                    <PresentationAI />
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                    <AnalyticsDashboard />
                </TabsContent>

                {isSuperAdmin && (
                    <TabsContent value="api-config" className="mt-6">
                        <APIConfigPanel />
                    </TabsContent>
                )}
            </Tabs>

            <style>{`
                @keyframes slide {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
            `}</style>
        </div>
    );
};

export default AIDocuments;
