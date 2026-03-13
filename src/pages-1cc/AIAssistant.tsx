import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui-1cc/card";
import { Button } from "@/components/ui-1cc/button";
import { Badge } from "@/components/ui-1cc/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks-1cc/use-toast";
import { Sparkles, TrendingUp, Users, Package, BarChart3, CheckCircle2, Clock } from "lucide-react";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  data: Record<string, unknown>;
}

const AIAssistant = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRecommendations((data as any[])?.slice(0, 10).map(item => ({
        ...item,
        data: item.data as Record<string, unknown>
      })) || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les recommandations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations');

      if (error) throw error;

      toast({
        title: "Recommandations générées",
        description: `${data.recommendations.length} nouvelles recommandations créées`,
      });

      fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Erreur",
        description: (error as Error).message || "Impossible de générer les recommandations",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      setRecommendations(prev =>
        prev.map(rec => rec.id === id ? { ...rec, is_read: true } : rec)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      client_contact: Users,
      deal_priority: TrendingUp,
      product_suggestion: Package,
      analytics_insight: BarChart3
    };
    return icons[type as keyof typeof icons] || Sparkles;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: "bg-destructive/10 text-destructive",
      high: "bg-warning/10 text-warning",
      medium: "bg-info/10 text-info",
      low: "bg-muted"
    };
    return colors[priority as keyof typeof colors] || "bg-muted";
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      client_contact: "Contact Client",
      deal_priority: "Opportunité Prioritaire",
      product_suggestion: "Suggestion Produit",
      analytics_insight: "Insight Analytics"
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-muted-foreground">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Assistant IA
            </h1>
            <p className="text-muted-foreground mt-2">
              Recommandations intelligentes pour optimiser vos ventes
            </p>
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={generating}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Génération en cours..." : "Générer Recommandations"}
          </Button>
        </div>

        {recommendations.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucune recommandation</h3>
            <p className="text-muted-foreground mb-4">
              Générez des recommandations IA pour optimiser votre activité
            </p>
            <Button onClick={generateRecommendations} disabled={generating} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Générer Recommandations
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const Icon = getTypeIcon(rec.type);
              return (
                <Card
                  key={rec.id}
                  className={`p-6 transition-all hover:shadow-md ${rec.is_read ? 'opacity-60' : ''
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{getTypeLabel(rec.type)}</Badge>
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority.toUpperCase()}
                            </Badge>
                            {rec.is_read && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Lu
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">{rec.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(rec.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{rec.description}</p>

                      {!rec.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(rec.id)}
                          className="gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
