import MainLayout from "@/components/layout/MainLayout";
import { useDailyHabits } from "@/hooks/useDailyHabits";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Moon, BookOpen, Github, Linkedin, Briefcase, Languages, GraduationCap, Dumbbell, Building2, DollarSign } from "lucide-react";

const habits = [
  { key: "tahajjud_prayer", label: "Tahajjud Prayer", icon: Moon, category: "Spiritual" },
  { key: "quran_recitation", label: "Quran Recitation", icon: BookOpen, category: "Spiritual" },
  { key: "github_contribution", label: "GitHub Contribution", icon: Github, category: "Professional" },
  { key: "linkedin_activity", label: "LinkedIn Activity", icon: Linkedin, category: "Professional" },
  { key: "professional_work", label: "Professional Work", icon: Briefcase, category: "Professional" },
  { key: "english_practice", label: "English Practice", icon: Languages, category: "Personal" },
  { key: "study_gpa_work", label: "Study/GPA Work", icon: GraduationCap, category: "Personal" },
  { key: "exercise_health", label: "Exercise/Health", icon: Dumbbell, category: "Personal" },
  { key: "mahris_work", label: "Mahris Company Work", icon: Building2, category: "Business" },
  { key: "earnings_task", label: "Earnings Task", icon: DollarSign, category: "Business" },
];

export default function DailyTracker() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const { habits: habitData, updateHabit, loading } = useDailyHabits();

  const categories = ["Spiritual", "Professional", "Personal", "Business"];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Daily Tracker</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category} className="glass rounded-2xl p-6 animate-slide-up">
              <h2 className="text-lg font-display font-semibold mb-4 text-primary">{category} Goals</h2>
              <div className="space-y-3">
                {habits
                  .filter((h) => h.category === category)
                  .map((habit) => {
                    const isChecked = habitData ? (habitData as any)[habit.key] : false;
                    return (
                      <label
                        key={habit.key}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          isChecked ? "bg-primary/20 border border-primary/50" : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => updateHabit(habit.key as any, checked as boolean)}
                          className="habit-checkbox"
                        />
                        <habit.icon className={`w-5 h-5 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`font-medium ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                          {habit.label}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}