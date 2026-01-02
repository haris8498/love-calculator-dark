import MainLayout from "@/components/layout/MainLayout";
import { useMonthlyHabits } from "@/hooks/useDailyHabits";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthlyView() {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { habits, loading } = useMonthlyHabits(2026, selectedMonth + 1);

  const getDaysInMonth = (month: number) => new Date(2026, month + 1, 0).getDate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Monthly View</h1>
          <p className="text-muted-foreground">View your monthly progress for 2026</p>
        </div>

        <Tabs value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <TabsList className="flex flex-wrap gap-1 h-auto bg-secondary/50 p-2 rounded-xl mb-6">
            {months.map((month, i) => (
              <TabsTrigger key={i} value={String(i)} className="rounded-lg data-[state=active]:bg-primary">
                {month.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {months.map((month, i) => (
            <TabsContent key={i} value={String(i)}>
              <Card className="glass rounded-2xl p-6">
                <h2 className="text-xl font-display font-semibold mb-4">{month} 2026</h2>
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-muted-foreground font-medium py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getDaysInMonth(i) }, (_, day) => {
                    const dateStr = `2026-${String(i + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
                    const dayHabit = habits.find((h) => h.habit_date === dateStr);
                    const completed = dayHabit ? Object.values(dayHabit).filter((v) => v === true).length : 0;
                    const hasData = !!dayHabit;

                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                          hasData && completed >= 5 ? "bg-success/30 text-success" : 
                          hasData && completed > 0 ? "bg-primary/20 text-primary" : 
                          "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className="font-medium">{day + 1}</span>
                        {hasData && <span className="text-xs">{completed}/10</span>}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}