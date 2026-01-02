import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useYearlyGoals } from "@/hooks/useYearlyGoals";
import { useDailyHabits } from "@/hooks/useDailyHabits";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Flame,
  ArrowRight,
  Github,
  Linkedin,
  Scale,
  DollarSign,
  GraduationCap,
  Moon,
  BookOpen
} from "lucide-react";

const goalIcons: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  weight: Scale,
  earnings: DollarSign,
  gpa: GraduationCap,
};

const habitLabels = [
  { key: "tahajjud_prayer", label: "Tahajjud", icon: Moon },
  { key: "quran_recitation", label: "Quran", icon: BookOpen },
  { key: "github_contribution", label: "GitHub", icon: Github },
  { key: "linkedin_activity", label: "LinkedIn", icon: Linkedin },
  { key: "professional_work", label: "Work", icon: Target },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { goals, loading: goalsLoading } = useYearlyGoals();
  const { habits, loading: habitsLoading } = useDailyHabits();

  const completedToday = habits
    ? Object.entries(habits).filter(
        ([key, value]) => key !== "id" && key !== "user_id" && key !== "habit_date" && key !== "created_at" && key !== "updated_at" && value === true
      ).length
    : 0;

  const totalHabits = 10;
  const todayProgress = Math.round((completedToday / totalHabits) * 100);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  // Get motivational message based on progress
  const getMotivation = () => {
    if (todayProgress === 100) return "Amazing! All tasks completed today! 🎉";
    if (todayProgress >= 70) return "Great work! Almost there! 💪";
    if (todayProgress >= 40) return "Good progress, keep going! 🚀";
    if (todayProgress > 0) return "Good start! Keep it up! ⭐";
    return "Start your day strong! Let's go! 🌟";
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground">{getMotivation()}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">{completedToday}/{totalHabits}</p>
            <p className="text-sm text-muted-foreground">Completed Today</p>
          </Card>

          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">{todayProgress}%</p>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
          </Card>

          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">{goals.length}</p>
            <p className="text-sm text-muted-foreground">Yearly Goals</p>
          </Card>

          <Card className="stat-card animate-slide-up" style={{ animationDelay: "0.25s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold">2026</p>
            <p className="text-sm text-muted-foreground">Target Year</p>
          </Card>
        </div>

        {/* Today's Habits */}
        <Card className="glass rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">Today's Habits</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/daily")}
              className="text-primary"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-semibold text-primary">{todayProgress}%</span>
            </div>
            <Progress value={todayProgress} className="h-3 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {habitLabels.map((habit) => {
              const isCompleted = habits ? (habits as any)[habit.key] : false;
              return (
                <div
                  key={habit.key}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    isCompleted 
                      ? "bg-primary/20 text-primary" 
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <habit.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{habit.label}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Yearly Goals */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">2026 Goals</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/analytics")}
              className="text-primary"
            >
              Analytics <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal, index) => {
              const Icon = goalIcons[goal.goal_type] || Target;
              const progress = goal.target_value > 0 
                ? Math.round((goal.current_value / goal.target_value) * 100) 
                : 0;

              return (
                <Card 
                  key={goal.id} 
                  className="stat-card animate-slide-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.goal_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={`font-semibold ${progress >= 50 ? "text-success" : "text-primary"}`}>
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 rounded-full" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}