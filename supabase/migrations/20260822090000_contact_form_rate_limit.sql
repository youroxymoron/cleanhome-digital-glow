CREATE TABLE IF NOT EXISTS public.contact_submission_limits (
  ip_hash text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0,
  last_submission_hash text,
  last_submission_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submission_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.contact_submission_limits FROM anon, authenticated;
GRANT ALL ON public.contact_submission_limits TO service_role;

CREATE OR REPLACE FUNCTION public.check_contact_submission_rate(
  p_ip_hash text,
  p_submission_hash text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_record public.contact_submission_limits%ROWTYPE;
  current_time timestamptz := now();
  retry_after_seconds integer;
BEGIN
  IF length(p_ip_hash) <> 64 OR length(p_submission_hash) <> 64 THEN
    RETURN jsonb_build_object('allowed', false, 'duplicate', false, 'retry_after', 600);
  END IF;

  INSERT INTO public.contact_submission_limits (
    ip_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_ip_hash, current_time, 0, current_time)
  ON CONFLICT (ip_hash) DO NOTHING;

  SELECT *
  INTO current_record
  FROM public.contact_submission_limits
  WHERE ip_hash = p_ip_hash
  FOR UPDATE;

  IF current_record.last_submission_hash = p_submission_hash
     AND current_record.last_submission_at > current_time - interval '30 minutes' THEN
    RETURN jsonb_build_object('allowed', false, 'duplicate', true, 'retry_after', 0);
  END IF;

  IF current_record.window_started_at <= current_time - interval '10 minutes' THEN
    UPDATE public.contact_submission_limits
    SET window_started_at = current_time,
        request_count = 1,
        updated_at = current_time
    WHERE ip_hash = p_ip_hash;

    RETURN jsonb_build_object('allowed', true, 'duplicate', false, 'retry_after', 0);
  END IF;

  IF current_record.request_count >= 2 THEN
    retry_after_seconds := GREATEST(
      1,
      EXTRACT(EPOCH FROM (
        current_record.window_started_at + interval '10 minutes' - current_time
      ))::integer
    );
    RETURN jsonb_build_object(
      'allowed', false,
      'duplicate', false,
      'retry_after', retry_after_seconds
    );
  END IF;

  UPDATE public.contact_submission_limits
  SET request_count = request_count + 1,
      updated_at = current_time
  WHERE ip_hash = p_ip_hash;

  RETURN jsonb_build_object('allowed', true, 'duplicate', false, 'retry_after', 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_contact_submission_delivered(
  p_ip_hash text,
  p_submission_hash text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.contact_submission_limits
  SET last_submission_hash = p_submission_hash,
      last_submission_at = now(),
      updated_at = now()
  WHERE ip_hash = p_ip_hash;
$$;

REVOKE ALL ON FUNCTION public.check_contact_submission_rate(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_contact_submission_delivered(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_contact_submission_rate(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_contact_submission_delivered(text, text) TO service_role;
