import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InteractiveSpreadsheet, Column, Row } from "@/components/InteractiveSpreadsheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks-1cc/use-toast";

const Spreadsheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };

    checkAuth();

    // Check for Google OAuth token
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get("google_token");
    if (googleToken) {
      localStorage.setItem("google_access_token", googleToken);
      toast({
        title: "Compte Google connecté",
        description: "Vous pouvez maintenant importer vos Sheets.",
      });
      // Remove query param without reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSave = (columns: Column[], rows: Row[]) => {
    // For now, save to localStorage
    // In production, you could save to Supabase
    localStorage.setItem("spreadsheet_columns", JSON.stringify(columns));
    localStorage.setItem("spreadsheet_rows", JSON.stringify(rows));
    toast({
      title: "Données sauvegardées",
      description: "Vos données ont été enregistrées localement.",
    });
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

  // Load from localStorage if available
  const savedColumns = localStorage.getItem("spreadsheet_columns");
  const savedRows = localStorage.getItem("spreadsheet_rows");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tableur interactif</h1>
          <p className="text-muted-foreground">
            Créez et modifiez des données en temps réel. Importez/exportez en CSV.
          </p>
        </div>

        <InteractiveSpreadsheet
          title="Mon Tableur"
          initialColumns={savedColumns ? JSON.parse(savedColumns) : undefined}
          initialRows={savedRows ? JSON.parse(savedRows) : undefined}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  );
};

export default Spreadsheet;
