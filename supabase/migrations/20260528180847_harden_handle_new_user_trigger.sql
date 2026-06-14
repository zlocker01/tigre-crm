CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar_url, role, email)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      'Usuario'
    ),
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', '') IN ('admin', 'empleado', 'cliente', 'user')
        THEN NEW.raw_user_meta_data->>'role'
      ELSE 'user'
    END,
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    role = COALESCE(EXCLUDED.role, public.users.role);

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'handle_new_user failed for id=% email=%: %', NEW.id, NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;
;
