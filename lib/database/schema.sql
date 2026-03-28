-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  weaknesses JSONB
);

-- Quiz answers table
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  total_quizzes INTEGER DEFAULT 0,
  avg_score FLOAT DEFAULT 0,
  weaknesses JSONB,
  streak INTEGER DEFAULT 0,
  last_quiz_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for courses
CREATE POLICY "Anyone can read courses" ON courses
  FOR SELECT USING (true);

-- RLS Policies for quizzes
CREATE POLICY "Users can read own quizzes" ON quizzes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quizzes" ON quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes" ON quizzes
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for quiz_answers
CREATE POLICY "Users can read own answers" ON quiz_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_answers.quiz_id AND quizzes.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own answers" ON quiz_answers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_answers.quiz_id AND quizzes.user_id = auth.uid())
  );

-- RLS Policies for user_progress
CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert course data
INSERT INTO courses (name, grade_level, subject, description) VALUES
  ('Matematik Åk 6', 'åk6', 'Matematik', 'Träna på nationella prov i matematik för år 6'),
  ('Engelska Åk 6', 'åk6', 'Engelska', 'Träna på nationella prov i engelska för år 6'),
  ('Svenska Åk 6', 'åk6', 'Svenska', 'Träna på nationella prov i svenska för år 6'),
  ('Matematik Åk 9', 'åk9', 'Matematik', 'Träna på nationella prov i matematik för år 9'),
  ('Engelska Åk 9', 'åk9', 'Engelska', 'Träna på nationella prov i engelska för år 9'),
  ('Svenska Åk 9', 'åk9', 'Svenska', 'Träna på nationella prov i svenska för år 9'),
  ('Engelska Nivå 1', 'gymnasiet', 'Engelska', 'Träna på nationella prov i engelska nivå 1'),
  ('Engelska Nivå 2', 'gymnasiet', 'Engelska', 'Träna på nationella prov i engelska nivå 2'),
  ('Svenska Nivå 1', 'gymnasiet', 'Svenska', 'Träna på nationella prov i svenska nivå 1'),
  ('Svenska Nivå 3', 'gymnasiet', 'Svenska', 'Träna på nationella prov i svenska nivå 3'),
  ('Matematik Nivå 1', 'gymnasiet', 'Matematik', 'Träna på nationella prov i matematik nivå 1'),
  ('Matematik Nivå 2', 'gymnasiet', 'Matematik', 'Träna på nationella prov i matematik nivå 2');
