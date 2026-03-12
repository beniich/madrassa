import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock registration process
        setTimeout(() => {
            setIsLoading(false);
            navigate('/pricing'); // Go to pricing after registration
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#222222] p-4 font-sans text-white">
            <div className="w-full max-w-lg">
                {/* Registration Card */}
                <Card className="bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="text-center space-y-4 pt-10 pb-6 bg-[#222222] text-white">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg transform rotate-3">
                                <GraduationCap className="w-12 h-12 text-[#222222]" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-4xl font-black italic tracking-tighter text-white">Rejoignez-nous</CardTitle>
                            <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                                Créez votre compte SchoolGenius
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 space-y-6 bg-white text-gray-900 border-t-4 border-primary">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="font-black text-xs uppercase tracking-widest text-gray-400">Prénom</Label>
                                    <Input id="firstName" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" placeholder="Ahmed" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="font-black text-xs uppercase tracking-widest text-gray-400">Nom</Label>
                                    <Input id="lastName" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" placeholder="Benali" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="school" className="font-black text-xs uppercase tracking-widest text-gray-400">Établissement</Label>
                                <Input id="school" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" placeholder="Nom de votre école" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-black text-xs uppercase tracking-widest text-gray-400">Email</Label>
                                <Input id="email" type="email" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" placeholder="contact@ecole.com" />
                            </div>

                            <div className="space-y-2 pb-4">
                                <Label htmlFor="password" className="font-black text-xs uppercase tracking-widest text-gray-400">Mot de passe</Label>
                                <Input id="password" type="password" required className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-xl" placeholder="••••••••" />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-14 bg-[#222222] hover:bg-[#333333] text-white rounded-xl font-black uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1"
                            >
                                {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 text-primary" />}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <p className="text-sm font-bold text-gray-400">
                                Vous avez déjà un compte ?{' '}
                                <a href="/login" className="text-[#222222] hover:text-primary transition-colors hover:underline">
                                    Connectez-vous
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
