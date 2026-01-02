import MainLayout from "@/components/layout/MainLayout";
import { useYearlyGoals } from "@/hooks/useYearlyGoals";
import { useMonthlyHabits } from "@/hooks/useDailyHabits";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Target, TrendingUp, Award, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";

const COLORS = ["hsl(262, 83%, 58%)", "hsl(172, 66%, 50%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

const habitKeys = [
  "tahajjud_prayer", "quran_recitation", "github_contribution", "linkedin_activity",
  "professional_work", "english_practice", "study_gpa_work", "exercise_health",
  "mahris_work", "earnings_task"
] as const;

export default function Analytics() {
  const { goals, updateGoal } = useYearlyGoals();
  const currentMonth = new Date().getMonth();
  const { habits } = useMonthlyHabits(2026, currentMonth + 1);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Calculate weekly data from actual habits
  const weeklyData = useMemo(() => {
    const weeks = [
      { name: "Week 1", days: [1, 2, 3, 4, 5, 6, 7] },
      { name: "Week 2", days: [8, 9, 10, 11, 12, 13, 14] },
      { name: "Week 3", days: [15, 16, 17, 18, 19, 20, 21] },
      { name: "Week 4", days: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
    ];

    return weeks.map((week) => {
      let totalCompleted = 0;
      let totalPossible = 0;

      week.days.forEach((day) => {
        const dateStr = `2026-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayHabit = habits.find((h) => h.habit_date === dateStr);
        
        if (dayHabit) {
          habitKeys.forEach((key) => {
            if (dayHabit[key] === true) totalCompleted++;
          });
          totalPossible += 10;
        }
      });

      const completed = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
      return { name: week.name, completed };
    });
  }, [habits, currentMonth]);

  const pieData = goals.map((g) => ({
    name: g.goal_name,
    value: g.target_value > 0 ? Math.round((g.current_value / g.target_value) * 100) : 0,
  }));

  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.target_value > 0 ? (g.current_value / g.target_value) * 100 : 0), 0) / goals.length)
    : 0;

  // Calculate total days tracked this month
  const daysTracked = habits.length;

  // Calculate total habits completed this month
  const totalHabitsCompleted = useMemo(() => {
    return habits.reduce((total, day) => {
      return total + habitKeys.filter((key) => day[key] === true).length;
    }, 0);
  }, [habits]);

  const getMotivation = () => {
    if (avgProgress >= 80) return "Outstanding! You are a champion! 🏆";
    if (avgProgress >= 60) return "Excellent progress! Keep pushing! 💪";
    if (avgProgress >= 40) return "Good work! Consistency is key! 🔑";
    if (daysTracked === 0) return "No data yet. Start using the daily tracker! 📝";
    return "Every step counts! Let's accelerate! 🚀";
  };

  const handleUpdateGoal = (goalId: string) => {
    const value = parseInt(editValue);
    if (!isNaN(value) && value >= 0) {
      updateGoal(goalId, value);
    }
    setEditingGoal(null);
    setEditValue("");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">{getMotivation()}</p>
        </div>

        {/* Overview Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="stat-card animate-slide-up">
            <TrendingUp className="w-8 h-8 text-primary mb-2" />
            <p className="text-3xl font-display font-bold">{avgProgress}%</p>
            <p className="text-sm text-muted-foreground">Goals Progress</p>
          </Card>
          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Target className="w-8 h-8 text-accent mb-2" />
            <p className="text-3xl font-display font-bold">{totalHabitsCompleted}</p>
            <p className="text-sm text-muted-foreground">Habits Completed</p>
          </Card>
          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Award className="w-8 h-8 text-warning mb-2" />
            <p className="text-3xl font-display font-bold">{daysTracked}</p>
            <p className="text-sm text-muted-foreground">Days Tracked</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="glass rounded-2xl p-6 animate-slide-up">
            <h2 className="text-lg font-display font-semibold mb-4">Weekly Completion Rate</h2>
            {habits.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                  <Bar dataKey="completed" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Use the daily tracker to see data here
              </div>
            )}
          </Card>

          {/* Pie Chart */}
          <Card className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-lg font-display font-semibold mb-4">Goals Progress</h2>
            {goals.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" label={({ name }) => name.split(" ")[0]}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Loading goals...
              </div>
            )}
          </Card>
        </div>

        {/* Goals Update */}
        <Card className="glass rounded-2xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Update Your Goals</h2>
          </div>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = goal.target_value > 0 ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
                return (
                  <div key={goal.id} className="p-4 bg-secondary rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{goal.goal_name}</span>
                      {editingGoal === goal.id ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 h-8"
                            placeholder={String(goal.current_value)}
                          />
                          <Button size="sm" onClick={() => handleUpdateGoal(goal.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingGoal(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => { setEditingGoal(goal.id); setEditValue(String(goal.current_value)); }}>
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </Button>
                      )}
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Loading goals...
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}