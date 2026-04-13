alter table public.review_logs
  add column if not exists cue_level smallint not null default 0,
  add column if not exists retrieval_kind text not null default 'exact';

update public.review_logs
set cue_level = coalesce(cue_level, 0)
where cue_level is null;

update public.review_logs
set retrieval_kind = coalesce(
  retrieval_kind,
  case
    when correct then 'exact'
    else 'failed'
  end
)
where retrieval_kind is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_logs'::regclass
      and conname = 'review_logs_cue_level_check'
  ) then
    alter table public.review_logs
      add constraint review_logs_cue_level_check
      check (cue_level between 0 and 1);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_logs'::regclass
      and conname = 'review_logs_retrieval_kind_check'
  ) then
    alter table public.review_logs
      add constraint review_logs_retrieval_kind_check
      check (retrieval_kind in ('exact', 'assisted', 'approximate', 'failed', 'created'));
  end if;
end
$$;
