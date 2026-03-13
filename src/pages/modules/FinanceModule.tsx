import DetailPane from "@/components/dashboard/DetailPane";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const FinanceModule = () => {
  return (
    <DetailPane title="Facturation" subtitle="Gestion financière de l'établissement">
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Revenu Total", amount: "42,500 $", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", arrow: ArrowUpRight },
            { title: "Dépenses", amount: "18,200 $", trend: "-2.4%", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50", arrow: ArrowDownRight },
            { title: "Bénéfice Net", amount: "24,300 $", trend: "+8.1%", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", arrow: ArrowUpRight },
          ].map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm rounded-2xl overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                   <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                     <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                     <stat.arrow className="w-3.5 h-3.5" />
                     <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{stat.trend}</span>
                   </div>
                 </div>
                 <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-black italic tracking-tighter text-gray-900">{stat.amount}</h3>
                 </div>
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Breakdown */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black italic tracking-tighter uppercase">Transactions Récentes</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Flux de trésorerie du mois en cours</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest border-gray-100">
                  <Filter className="w-3 h-3 mr-2" /> Filtrer
                </Button>
                <Button size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white hover:bg-black">
                  Excl. Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-y border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Catégorie</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Montant</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { desc: "Scolarité - Ahmed Benali", cat: "Revenu", date: "Aujourd'hui", amount: "+450 $", status: "emerald" },
                      { desc: "Loyer Local A", cat: "Dépense", date: "Hier", amount: "-1,200 $", status: "rose" },
                      { desc: "Frais Internet", cat: "Dépense", date: "10 Mar", amount: "-45 $", status: "rose" },
                      { desc: "Donation Fondation", cat: "Autre", date: "08 Mar", amount: "+500 $", status: "blue" },
                      { desc: "Salaire Personnel", cat: "Salaire", date: "05 Mar", amount: "-8,500 $", status: "rose" },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 font-black italic text-sm tracking-tighter text-slate-700">{item.desc}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest rounded-lg border-gray-100">
                            {item.cat}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-400">{item.date}</td>
                        <td className={`px-6 py-4 text-sm font-black italic tracking-tighter text-${item.status}-600`}>{item.amount}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg group-hover:bg-white border border-transparent group-hover:border-gray-100">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Budget Progress */}
          <div className="space-y-4">
            <Card className="border-none shadow-sm rounded-2xl bg-indigo-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <CardHeader>
                <CardTitle className="text-white text-sm font-black italic tracking-tighter uppercase flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-200" />
                  Budget du mois
                </CardTitle>
                <CardDescription className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Calculé vs Objectif annuel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Avancement</span>
                    <span className="text-lg font-black italic tracking-tighter">72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-indigo-400/30 indicator-bg-white" />
                </div>
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Reste à percevoir</p>
                  <p className="text-xl font-black italic tracking-tighter font-mono">12,450.00 $</p>
                </div>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest h-10 rounded-xl">
                  Voir prévisions
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-black italic tracking-tighter uppercase">Rapports rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Bilan T1 2026", "Taxes & Impôts", "Remboursement élèves"].map((doc, idx) => (
                  <Button key={idx} variant="ghost" className="w-full justify-between items-center group py-6 px-4 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{doc}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DetailPane>
  );
};

export default FinanceModule;
