import { useHospitalStore, LeaveRequest } from "@/stores/useHospitalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Badge } from "@/components/ui-1cc/badge";
import { Button } from "@/components/ui-1cc/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui-1cc/table";
import { Check, X, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks-1cc/use-toast";

export function LeaveRequestsManager() {
    const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } =
        useHospitalStore();

    const pendingRequests = leaveRequests.filter((r) => r.status === "pending");
    const recentRequests = leaveRequests
        .filter((r) => r.status !== "pending")
        .slice(0, 5);

    const getTypeColor = (type: string) => {
        switch (type) {
            case "CP":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "RTT":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "Maladie":
                return "bg-orange-100 text-orange-700 border-orange-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                        Validé
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                        Refusé
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        En attente
                    </Badge>
                );
        }
    };

    const handleApprove = (request: LeaveRequest) => {
        approveLeaveRequest(request.id, "Validé par le manager");
        toast({
            title: "Demande validée",
            description: `La demande de ${request.staffName} a été approuvée.`,
            className: "bg-green-600 text-white",
        });
    };

    const handleReject = (request: LeaveRequest) => {
        rejectLeaveRequest(request.id, "Refusé - Période non disponible");
        toast({
            title: "Demande refusée",
            description: `La demande de ${request.staffName} a été refusée.`,
            variant: "destructive",
        });
    };

    return (
        <div className="space-y-6">
            {/* Pending Requests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        Demandes en Attente ({pendingRequests.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Aucune demande en attente</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employé</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Période</TableHead>
                                    <TableHead>Durée</TableHead>
                                    <TableHead>Motif</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">
                                            {request.staffName}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getTypeColor(request.type)}
                                            >
                                                {request.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {format(new Date(request.startDate), "dd MMM", {
                                                locale: fr,
                                            })}{" "}
                                            -{" "}
                                            {format(new Date(request.endDate), "dd MMM yyyy", {
                                                locale: fr,
                                            })}
                                        </TableCell>
                                        <TableCell>{request.days} jour(s)</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                            {request.reason || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 text-green-600 hover:bg-green-50 border-green-200"
                                                    onClick={() => handleApprove(request)}
                                                >
                                                    <Check className="h-4 w-4" /> Valider
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-1 text-red-600 hover:bg-red-50 border-red-200"
                                                    onClick={() => handleReject(request)}
                                                >
                                                    <X className="h-4 w-4" /> Refuser
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Recent Decisions */}
            {recentRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Décisions Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium text-sm">{request.staffName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {request.type} •{" "}
                                                {format(new Date(request.startDate), "dd MMM", {
                                                    locale: fr,
                                                })}{" "}
                                                -{" "}
                                                {format(new Date(request.endDate), "dd MMM", {
                                                    locale: fr,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
