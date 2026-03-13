import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TaskKanban } from "@/components/TaskKanban";
import { TaskCalendar } from "@/components/TaskCalendar";
import { TaskList } from "@/components/TaskList";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskFilters } from "@/components/TaskFilters"; // Import Filters
import { TaskTimeline } from "@/components/TaskTimeline"; // Import Timeline
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { Button } from "@/components/ui-1cc/button";
import { Plus, LayoutGrid, Calendar, List, Clock } from "lucide-react"; // Import Clock icon
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks-1cc/use-toast";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date?: string;
  user_id: string;
  subtasks?: Subtask[];
  tags?: string[];
}

const Tasks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const fetchTasks = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTasks((data as any) || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchTasks(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchTasks(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, fetchTasks]);

  // Derived state for available tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach(task => task.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [tasks]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(tag => task.tags?.includes(tag));

      const matchesPriority =
        selectedPriorities.length === 0 ||
        selectedPriorities.includes(task.priority);

      return matchesSearch && matchesTags && matchesPriority;
    });
  }, [tasks, searchQuery, selectedTags, selectedPriorities]);

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task
      ));
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSaveTask = async (taskData: Omit<Task, "id" | "user_id">) => {
    if (!user) return;

    try {
      if (editingTask) {
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", editingTask.id);

        if (error) throw error;

        setTasks(tasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        ));
        toast({ title: "Tâche mise à jour" });
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert({ ...taskData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;

        setTasks([data as unknown as Task, ...tasks]);
        toast({ title: "Tâche créée" });
      }
      setEditingTask(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));
      toast({ title: "Tâche supprimée" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority) ? prev.filter(p => p !== priority) : [...prev, priority]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedPriorities([]);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestion des tâches</h1>
            <p className="text-muted-foreground">
              Organisez et suivez vos tâches
            </p>
          </div>
          <Button onClick={handleAddTask} variant="neumorphismPrimary">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>

        <TaskFilters
          search={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          availableTags={availableTags}
          selectedPriorities={selectedPriorities}
          onPriorityToggle={togglePriority}
          onClear={clearFilters}
        />

        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="shadow-neu bg-background rounded-xl p-1">
            <TabsTrigger value="kanban" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <TaskKanban
              tasks={filteredTasks}
              onTaskMove={handleTaskMove}
              onAddTask={handleAddTask}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <TaskCalendar
              tasks={filteredTasks}
              onTaskClick={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <TaskTimeline
              tasks={filteredTasks}
              onTaskClick={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <TaskList
              tasks={filteredTasks}
              onStatusChange={handleTaskMove}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </DashboardLayout>
  );
};

export default Tasks;
