import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface YearlyGoal {
  id: string;
  user_id: string;
  goal_type: string;
  goal_name: string;
  target_value: number;
  current_value: number;
  unit: string | null;
  year: number;
}

export function useYearlyGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<YearlyGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("yearly_goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("year", 2026);

    if (error) {
      console.error("Error fetching goals:", error);
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  };

  const updateGoal = async (goalId: string, currentValue: number) => {
    const { error } = await supabase
      .from("yearly_goals")
      .update({ current_value: currentValue })
      .eq("id", goalId);

    if (error) {
      console.error("Error updating goal:", error);
    } else {
      setGoals(goals.map(g => g.id === goalId ? { ...g, current_value: currentValue } : g));
    }
  };

  return { goals, loading, updateGoal, refetch: fetchGoals };
}