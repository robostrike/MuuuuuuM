-- First, check if the table exists
DO $$
BEGIN
  -- Create game_responses table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'game_responses') THEN
    CREATE TABLE public.game_responses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id TEXT, -- Optional user identifier (can be anonymous)
      session_id TEXT NOT NULL, -- Session identifier for grouping responses
      content_id INTEGER NOT NULL,
      content_type TEXT NOT NULL, -- 'words', 'gifs', or 'png'
      position_x INTEGER NOT NULL,
      position_y INTEGER NOT NULL,
      metadata JSONB -- For additional data we might want to store
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS game_responses_session_id_idx ON public.game_responses (session_id);
    CREATE INDEX IF NOT EXISTS game_responses_content_idx ON public.game_responses (content_type, content_id);
    
    -- Comment on table
    COMMENT ON TABLE public.game_responses IS 'Stores user responses to various content items on a grid';

  -- If the table exists but is missing the session_id column, add it
  ELSIF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'game_responses' 
    AND column_name = 'session_id'
  ) THEN
    ALTER TABLE public.game_responses ADD COLUMN session_id TEXT;
    -- Create index for the new column
    CREATE INDEX IF NOT EXISTS game_responses_session_id_idx ON public.game_responses (session_id);
  END IF;
END
$$;

-- Ensure RLS is enabled
ALTER TABLE public.game_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop policies if they exist
  BEGIN
    DROP POLICY IF EXISTS "Authenticated users can insert their own responses" ON public.game_responses;
  EXCEPTION
    WHEN undefined_object THEN
      -- Policy doesn't exist, do nothing
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Authenticated users can view their own responses" ON public.game_responses;
  EXCEPTION
    WHEN undefined_object THEN
      -- Policy doesn't exist, do nothing
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Anon users can insert responses" ON public.game_responses;
  EXCEPTION
    WHEN undefined_object THEN
      -- Policy doesn't exist, do nothing
  END;
  
  BEGIN
    DROP POLICY IF EXISTS "Anon users can view responses" ON public.game_responses;
  EXCEPTION
    WHEN undefined_object THEN
      -- Policy doesn't exist, do nothing
  END;
END
$$;

-- Create fresh policies
CREATE POLICY "Authenticated users can insert their own responses" ON public.game_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own responses" ON public.game_responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anon users can insert responses" ON public.game_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon users can view responses" ON public.game_responses
  FOR SELECT
  TO anon
  USING (true);

-- Make sure to NOT REQUIRE session_id for existing rows
ALTER TABLE public.game_responses ALTER COLUMN session_id DROP NOT NULL;

-- Update NULL session_ids with a placeholder (for any existing data)
UPDATE public.game_responses SET session_id = 'legacy_data' WHERE session_id IS NULL;