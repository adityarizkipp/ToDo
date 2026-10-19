-- 1. Pastikan tabel tasks memiliki kolom user_id
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    notes TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
    category TEXT NOT NULL DEFAULT 'General',
    due_date TIMESTAMPTZ,
    subtasks JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMPTZ,
    position DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy lama jika ada
DROP POLICY IF EXISTS "Public full access to tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can manage their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can only access their own tasks" ON public.tasks;

-- 4. Buat Kebijakan RLS yang Aman & Terisolasi per User
CREATE POLICY "Users can only access their own tasks"
ON public.tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Stored Procedure RPC untuk Phase 5: Weekly Productivity (Hanya menghitung task milik user yang sedang login)
CREATE OR REPLACE FUNCTION get_weekly_productivity()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    current_uid UUID;
BEGIN
    current_uid := auth.uid();
    
    WITH past_7_days AS (
        SELECT (CURRENT_DATE - (i || ' day')::INTERVAL)::DATE as day_date
        FROM generate_series(0, 6) AS i
    ),
    completion_counts AS (
        SELECT 
            DATE(completed_at) as comp_date,
            COUNT(*) as task_count
        FROM public.tasks
        WHERE 
            status = 'done'
            AND completed_at >= (CURRENT_DATE - INTERVAL '6 days')
            AND (current_uid IS NULL OR user_id = current_uid)
        GROUP BY DATE(completed_at)
    )
    SELECT json_agg(
        json_build_object(
            'date', TO_CHAR(d.day_date, 'YYYY-MM-DD'),
            'dayName', TO_CHAR(d.day_date, 'Dy'),
            'completedCount', COALESCE(c.task_count, 0)
        ) ORDER BY d.day_date ASC
    ) INTO result
    FROM past_7_days d
    LEFT JOIN completion_counts c ON d.day_date = c.comp_date;

    RETURN result;
END;
$$;
