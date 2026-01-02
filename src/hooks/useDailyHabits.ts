import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DailyHabit {
  id: string;
  user_id: string;
  habit_date: string;
  tahajjud_prayer: boolean;
  quran_recitation: boolean;
  github_contribution: boolean;
  linkedin_activity: boolean;
  professional_work: boolean;
  english_practice: boolean;
  study_gpa_work: boolean;
  exercise_health: boolean;
  mahris_work: boolean;
  earnings_task: boolean;
}

export function useDailyHabits(date?: string) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<DailyHabit | null>(null);
  const [loading, setLoading] = useState(true);

  const targetDate = date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchHabits();
  }, [user, targetDate]);

  const fetchHabits = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("daily_habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("habit_date", targetDate)
      .maybeSingle();

    if (error) {
      console.error("Error fetching habits:", error);
    } else {
      setHabits(data);
    }
    setLoading(false);
  };

  const updateHabit = async (habitKey: keyof DailyHabit, value: boolean) => {
    if (!user) return;

    if (habits) {
      // Update existing record
      const { error } = await supabase
        .from("daily_habits")
        .update({ [habitKey]: value })
        .eq("id", habits.id);

      if (error) {
        console.error("Error updating habit:", error);
      } else {
        setHabits({ ...habits, [habitKey]: value });
      }
    } else {
      // Create new record
      const newHabit = {
        user_id: user.id,
        habit_date: targetDate,
        [habitKey]: value,
      };

      const { data, error } = await supabase
        .from("daily_habits")
        .insert(newHabit)
        .select()
        .single();

      if (error) {
        console.error("Error creating habit:", error);
      } else {
        setHabits(data);
      }
    }
  };

  return { habits, loading, updateHabit, refetch: fetchHabits };
}

export function useMonthlyHabits(year: number, month: number) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<DailyHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchMonthlyHabits();
  }, [user, year, month]);

  const fetchMonthlyHabits = async () => {
    if (!user) return;

    setLoading(true);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    const { data, error } = await supabase
      .from("daily_habits")
      .select("*")
      .eq("user_id", user.id)
      .gte("habit_date", startDate)
      .lte("habit_date", endDate)
      .order("habit_date", { ascending: true });

    if (error) {
      console.error("Error fetching monthly habits:", error);
    } else {
      setHabits(data || []);
    }
    setLoading(false);
  };

  return { habits, loading, refetch: fetchMonthlyHabits };
}