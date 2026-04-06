import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, Building, LogOut, Camera, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Profile = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#222222] font-black italic tracking-widest uppercase text-xs">Initialisation Session...</p>
                </div>
            </div>
        );
    }

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            direction: 'bg-[#222222] text-primary border-primary/20',
            admin: 'bg-primary text-white border-transparent',
            teacher: 'bg-secondary text-[#222222] border-primary/10',
            parent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        };
        return colors[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header Premium Section */}
            <div className="bg-[#222222] rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                    <User className="h-40 w-40 text-primary -rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-5xl font-black border-8 border-white/10 shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="italic tracking-tighter">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-4 bg-primary text-white rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="text-center md:text-left space-y-4">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">
                                {user.firstName} <span className="text-primary">{user.lastName}</span>
                            </h1>
                            <Badge className={cn("px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] italic border shadow-lg", getRoleBadge(user.role))}>
                                {t(`roles.${user.role}`)}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                            <p className="text-gray-400 font-bold flex items-center gap-2 text-sm italic">
                                <Mail className="w-4 h-4 text-primary" />
                                {user.email}
                            </p>
                            <div className="h-1 w-1 rounded-full bg-primary/40 hidden md:block"></div>
                            <p className="text-gray-400 font-bold flex items-center gap-2 text-sm italic">
                                <Building className="w-4 h-4 text-primary" />
                                SchoolGenius Academy
                            </p>
                        </div>
                    </div>

                    <div className="md:ml-auto flex flex-col sm:flex-row gap-4 relative z-10">
                        <Button className="h-14 px-8 bg-white hover:bg-secondary text-[#222222] font-black rounded-2xl shadow-xl transition-all active:scale-95 gap-3 border-none uppercase text-xs tracking-widest">
                            <Edit2 className="w-4 h-4" /> MODIFIER
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={logout} 
                            className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95 gap-3 border-none uppercase text-xs tracking-widest"
                        >
                            <LogOut className="w-4 h-4" /> QUITTER
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-2 lg:px-0">
                {/* Information Personnelle */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] p-4 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform">
                        <Shield className="h-32 w-32" />
                    </div>
                    <CardHeader className="p-8 md:p-12 pb-4">
                        <CardTitle className="text-2xl font-black text-gray-900 tracking-tighter italic flex items-center gap-4 leading-none uppercase">
                            <div className="h-12 w-12 bg-secondary/50 rounded-2xl flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            Identité Académique
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 ml-16 italic">Settings de compte et registre personnel</CardDescription>
                    </CardHeader>
                    <Separator className="mx-8 md:mx-12 bg-gray-100/50" />
                    <CardContent className="p-8 md:p-12 pt-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { label: 'First Name', val: user.firstName, icon: User },
                                { label: 'Last Name de famille', val: user.lastName, icon: User },
                                { label: 'Adresse de contact', val: user.email, icon: Mail },
                                { label: 'Matricule Système', val: `#${user.schoolId}`, icon: Shield },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3 group/field">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-1 group-hover/field:text-primary transition-colors">{item.label}</p>
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-secondary/30 flex items-center justify-between group-hover/field:bg-secondary/40 transition-all shadow-sm">
                                        <p className="text-lg text-gray-900 font-black italic tracking-tighter">{item.val}</p>
                                        <item.icon className="w-4 h-4 text-primary/40 group-hover/field:text-primary group-hover/field:scale-110 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sécurité & Rôles Sidebar */}
                <div className="space-y-10">
                    <Card className="border-none shadow-2xl bg-[#222222] text-white rounded-[3rem] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-12 transition-transform">
                            <Shield className="h-16 w-16 text-primary" />
                        </div>
                        <CardHeader className="p-0 mb-8">
                            <CardTitle className="text-xl font-black tracking-tighter italic flex items-center gap-3 leading-none uppercase">
                                Sécurité Flux
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <div className="p-6 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Rôle Système</span>
                                    <Badge className="bg-primary hover:bg-primary text-white border-none font-black italic text-[9px] tracking-widest px-4 py-1.5 rounded-full">
                                        {t(`roles.${user.role}`).toUpperCase()}
                                    </Badge>
                                </div>
                                <Separator className="bg-white/5" />
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">Dernière activité</p>
                                    <p className="text-sm font-black italic tracking-tighter text-primary">Aujourd'hui à {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <Button className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl">
                                MODIFIER LE MOT DE PASSE
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-8 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
                            <Building className="h-12 w-12 text-primary" />
                        </div>
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-3">
                                <Building className="w-5 h-5 text-primary" /> Affiliation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-6 bg-secondary/30 rounded-[2rem] border border-secondary shadow-inner space-y-3">
                                <p className="text-sm font-black text-[#222222] italic leading-none">SchoolGenius Academy</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] italic">Campus Principal • Paris</p>
                                <div className="pt-2">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-black italic text-[9px] tracking-widest px-3 py-1">HUB ACTIF</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
