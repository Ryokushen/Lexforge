alter table public.review_logs
  add column if not exists context_prompt_kind text;
