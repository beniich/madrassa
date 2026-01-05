
import { useState, useEffect } from "react";
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Plus,
    Search,
    Filter,
    Calendar,
    Layout,
    List as ListIcon,
    Tag,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tasksService } from "@/services/tasksService";
import { SchoolTask } from "@/types/school-365";
import { cn } from "@/lib/utils";

const TasksModule = () => {
    const [tasks, setTasks] = useState<SchoolTask[]>([]);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            const data = await tasksService.getTasks();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            default: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        }
    };

    const columns = [
        { id: 'todo', label: 'À faire', icon: Circle },
        { id: 'in-progress', label: 'En cours', icon: Clock },
        { id: 'completed', label: 'Terminé', icon: CheckCircle2 },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            {/* Planner Header */}
            <div className="h-14 px-6 border-b border-border bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">Planner Scolaire</h2>
                    <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-2", viewMode === 'kanban' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
                        >
                            <Layout size={14} />
                            Tableau
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-2", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
                        >
                            <ListIcon size={14} />
                            Liste
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden sm:block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filtrer les tâches..."
                            className="pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-48"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-md">
                        <Plus size={16} />
                        Ajouter une tâche
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-auto p-6">
                {viewMode === 'kanban' ? (
                    <div className="flex gap-6 h-full min-w-max">
                        {columns.map((column) => (
                            <div key={column.id} className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <column.icon size={16} className="text-slate-400" />
                                        <h3 className="font-bold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wider">{column.label}</h3>
                                        <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-[10px]">
                                            {tasks.filter(t => t.status === column.id).length}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    {tasks.filter(t => t.status === column.id).map(task => (
                                        <div
                                            key={task.id}
                                            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge className={cn("text-[9px] font-bold uppercase py-0.5", getPriorityColor(task.priority))}>
                                                    {task.priority}
                                                </Badge>
                                                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-md transition-opacity">
                                                    <MoreVertical size={14} className="text-slate-400" />
                                                </button>
                                            </div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2 leading-snug">{task.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Tag size={12} />
                                                    {task.category}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {task.dueDate}
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                        <User size={10} />
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
                                                    <AlertCircle size={10} className="text-yellow-500" />
                                                    Suivi IA actif
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                                        <Plus size={14} />
                                        Ajouter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm max-w-5xl mx-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Tâche</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Statut</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Échéance</th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-slate-500">Priorité</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tasks.map(task => (
                                    <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" className="rounded-full w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{task.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="text-[10px] font-bold uppercase border-none bg-slate-100 group-hover:bg-white text-slate-600">
                                                {task.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">{task.dueDate}</td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn("text-[9px] font-bold uppercase", getPriorityColor(task.priority))}>
                                                {task.priority}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksModule;

const MoreVertical = ({ size, className }: { size: number, className: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);
