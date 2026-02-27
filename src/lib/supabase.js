import { createClient } from '@supabase/supabase-js'

// ============================================
// Konfiguracja Supabase (OPCJONALNA)
// ============================================
// Aplikacja działa w pełni offline dzięki localStorage.
// Supabase służy TYLKO jako chmurowy backup sukcesów.
//
// Aby włączyć sync do chmury:
// 1. Skopiuj .env.example jako .env
// 2. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY
// 3. W Supabase utwórz tabelę "successes":
//    - id: uuid (primary key, default gen_random_uuid())
//    - text: text (not null)
//    - created_at: timestamptz (default now())
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
