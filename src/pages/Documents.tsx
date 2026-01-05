import { FileText, Upload, Folder, Download } from 'lucide-react';

export const Documents = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Documents</h1>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Glissez-déposez vos fichiers ici</p>
                <p className="text-sm text-gray-400 mt-2">ou</p>
                <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Parcourir
                </button>
            </div>

            {/* Liste documents */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Documents récents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="font-semibold text-gray-900 truncate">Document_Scolaire_{i}.pdf</p>
                            <p className="text-xs text-gray-500 mt-1">12 KB • Il y a 2h</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Documents;
