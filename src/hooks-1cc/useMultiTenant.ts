import { useEffect, useCallback } from "react";
import { useUserStore, UserDashboard, UserStats } from "@/store/useUserStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export const useMultiTenant = () => {
  const { toast } = useToast();
  const {
    user,
    session,
    profile,
    dashboard,
    stats,
    setUser,
    setSession,
    setLoading,
    setProfile,
    setDashboard,
    setStats,
    clearUserData,
  } = useUserStore();

  // Fetch user's profile (multi-tenant isolated)
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    setProfile(data);
    return data;
  }, [setProfile]);

  // Fetch user's dashboard config (multi-tenant isolated)
  const fetchDashboard = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_dashboards")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching dashboard:", error);
      return null;
    }
    
    if (data) {
      setDashboard(data as UserDashboard);
    }
    return data;
  }, [setDashboard]);

  // Fetch user's stats (multi-tenant isolated)
  const fetchStats = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching stats:", error);
      return null;
    }
    
    if (data) {
      setStats(data as UserStats);
    }
    return data;
  }, [setStats]);

  // Initialize user dashboard and stats if they don't exist
  const initializeUserSpace = useCallback(async (userId: string) => {
    // Check and create dashboard
    const existingDashboard = await fetchDashboard(userId);
    if (!existingDashboard) {
      const { data: newDashboard, error: dashError } = await supabase
        .from("user_dashboards")
        .insert({ user_id: userId })
        .select()
        .single();
      
      if (!dashError && newDashboard) {
        setDashboard(newDashboard as UserDashboard);
      }
    }

    // Check and create stats
    const existingStats = await fetchStats(userId);
    if (!existingStats) {
      const { data: newStats, error: statsError } = await supabase
        .from("user_stats")
        .insert({ user_id: userId })
        .select()
        .single();
      
      if (!statsError && newStats) {
        setStats(newStats as UserStats);
      }
    }
  }, [fetchDashboard, fetchStats, setDashboard, setStats]);

  // Load all user data (multi-tenant isolated)
  const loadUserData = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(userId),
        initializeUserSpace(userId),
      ]);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, initializeUserSpace, setLoading, toast]);

  // Update user stats
  const updateStats = useCallback(async (updates: {
    total_incidents?: number;
    ai_queries?: number;
    workflows_count?: number;
    digital_twins_count?: number;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_stats")
      .update({ ...updates, last_active: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setStats(data as UserStats);
    }
    return data;
  }, [user, setStats]);

  // Increment a specific stat
  const incrementStat = useCallback(async (
    statName: "total_incidents" | "ai_queries" | "workflows_count" | "digital_twins_count"
  ) => {
    if (!stats) return;
    
    const currentValue = stats[statName] || 0;
    return updateStats({ [statName]: currentValue + 1 });
  }, [stats, updateStats]);

  // Update dashboard config
  const updateDashboard = useCallback(async (updates: {
    layout?: Json;
    widgets?: Json;
    theme?: Json;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_dashboards")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setDashboard(data as UserDashboard);
    }
    return data;
  }, [user, setDashboard]);

  // Initialize auth listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer data loading with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            loadUserData(session.user.id);
          }, 0);
        } else {
          clearUserData();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, loadUserData, clearUserData, setLoading]);

  return {
    user,
    session,
    profile,
    dashboard,
    stats,
    isLoading: useUserStore((s) => s.isLoading),
    updateStats,
    incrementStat,
    updateDashboard,
    refreshUserData: () => user && loadUserData(user.id),
  };
};
