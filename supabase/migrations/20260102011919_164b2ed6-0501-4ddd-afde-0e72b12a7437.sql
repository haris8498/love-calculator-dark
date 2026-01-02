-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create yearly goals table
CREATE TABLE public.yearly_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  goal_name TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 0,
  current_value INTEGER NOT NULL DEFAULT 0,
  unit TEXT,
  year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on yearly_goals
ALTER TABLE public.yearly_goals ENABLE ROW LEVEL SECURITY;

-- Yearly goals policies
CREATE POLICY "Users can view their own yearly goals" 
ON public.yearly_goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own yearly goals" 
ON public.yearly_goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own yearly goals" 
ON public.yearly_goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own yearly goals" 
ON public.yearly_goals FOR DELETE 
USING (auth.uid() = user_id);

-- Create daily habits table
CREATE TABLE public.daily_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_date DATE NOT NULL,
  tahajjud_prayer BOOLEAN NOT NULL DEFAULT false,
  quran_recitation BOOLEAN NOT NULL DEFAULT false,
  github_contribution BOOLEAN NOT NULL DEFAULT false,
  linkedin_activity BOOLEAN NOT NULL DEFAULT false,
  professional_work BOOLEAN NOT NULL DEFAULT false,
  english_practice BOOLEAN NOT NULL DEFAULT false,
  study_gpa_work BOOLEAN NOT NULL DEFAULT false,
  exercise_health BOOLEAN NOT NULL DEFAULT false,
  mahris_work BOOLEAN NOT NULL DEFAULT false,
  earnings_task BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_date)
);

-- Enable RLS on daily_habits
ALTER TABLE public.daily_habits ENABLE ROW LEVEL SECURITY;

-- Daily habits policies
CREATE POLICY "Users can view their own daily habits" 
ON public.daily_habits FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily habits" 
ON public.daily_habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily habits" 
ON public.daily_habits FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily habits" 
ON public.daily_habits FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_yearly_goals_updated_at
BEFORE UPDATE ON public.yearly_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_habits_updated_at
BEFORE UPDATE ON public.daily_habits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  
  -- Insert default yearly goals for new user
  INSERT INTO public.yearly_goals (user_id, goal_type, goal_name, target_value, unit) VALUES
    (new.id, 'github', 'GitHub Contributions', 1000, 'contributions'),
    (new.id, 'linkedin', 'LinkedIn Connections', 500, 'connections'),
    (new.id, 'weight', 'Weight Loss', 15, 'kg'),
    (new.id, 'earnings', 'Earnings', 100000, 'PKR'),
    (new.id, 'gpa', 'GPA Target', 4, 'GPA');
  
  RETURN new;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();