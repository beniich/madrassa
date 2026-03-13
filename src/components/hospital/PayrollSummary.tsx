import { useHospitalStore } from "@/stores/useHospitalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Badge } from "@/components/ui-1cc/badge";
import { DollarSign, TrendingUp, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui-1cc/button";
import { generateStaffPayrollPDF } from "@/lib/pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PayrollSummaryProps {
    staffId: string;
}

export function PayrollSummary({ staffId }: PayrollSummaryProps) {
    const { payrollItems, staff } = useHospitalStore();
    const currentStaff = staff.find(s => s.id === staffId);

    const staffPayrolls = payrollItems
        .filter((p) => p.staffId === staffId)
        .sort((a, b) => b.month.localeCompare(a.month));

    const latestPayroll = staffPayrolls[0];

    if (!latestPayroll) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune fiche de paie disponible</p>
                </CardContent>
            </Card>
        );
    }

    const totalBonuses = latestPayroll.bonuses.reduce((sum, b) => sum + b.amount, 0);
    const totalDeductions = latestPayroll.deductions.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="space-y-6">
            {/* Current Month Summary */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="h-5 w-5" /> Salaire du Mois
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(latestPayroll.month + "-01"), "MMMM yyyy", { locale: fr })}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => currentStaff && generateStaffPayrollPDF(currentStaff, latestPayroll)}
                        >
                            <Download className="h-4 w-4" /> PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Salaire de base</span>
                            <span className="font-semibold">{latestPayroll.baseSalary.toLocaleString()} €</span>
                        </div>

                        {latestPayroll.bonuses.length > 0 && (
                            <>
                                <div className="border-t pt-2">
                                    <p className="text-xs font-semibold text-green-700 mb-2">Primes & Bonus</p>
                                    {latestPayroll.bonuses.map((bonus, idx) => (
                                        <div key={idx} className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">{bonus.description}</span>
                                            <span className="text-green-600">+{bonus.amount} €</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {latestPayroll.overtimePay > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Heures supplémentaires</span>
                                <span className="text-green-600">+{latestPayroll.overtimePay} €</span>
                            </div>
                        )}

                        {latestPayroll.deductions.length > 0 && (
                            <>
                                <div className="border-t pt-2">
                                    <p className="text-xs font-semibold text-red-700 mb-2">Déductions</p>
                                    {latestPayroll.deductions.map((deduction, idx) => (
                                        <div key={idx} className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">{deduction.description}</span>
                                            <span className="text-red-600">-{deduction.amount} €</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="border-t-2 pt-3 flex justify-between items-center">
                            <span className="font-bold">Net à payer</span>
                            <span className="text-2xl font-bold text-primary">
                                {latestPayroll.netSalary.toLocaleString()} €
                            </span>
                        </div>

                        <Badge
                            variant="outline"
                            className={
                                latestPayroll.status === "paid"
                                    ? "bg-green-50 text-green-700 border-green-200 w-full justify-center"
                                    : latestPayroll.status === "validated"
                                        ? "bg-blue-50 text-blue-700 border-blue-200 w-full justify-center"
                                        : "bg-yellow-50 text-yellow-700 border-yellow-200 w-full justify-center"
                            }
                        >
                            {latestPayroll.status === "paid"
                                ? "✓ Payé"
                                : latestPayroll.status === "validated"
                                    ? "Validé"
                                    : "Brouillon"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* History */}
            {staffPayrolls.length > 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Historique
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {staffPayrolls.slice(1, 4).map((payroll) => (
                                <div
                                    key={payroll.id}
                                    className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded border"
                                >
                                    <span className="text-sm">
                                        {format(new Date(payroll.month + "-01"), "MMM yyyy", { locale: fr })}
                                    </span>
                                    <span className="font-semibold">{payroll.netSalary.toLocaleString()} €</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
