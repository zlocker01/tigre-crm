
-- Eliminar políticas existentes de la tabla users
DROP POLICY IF EXISTS "Enable access for authenticated users on" ON public.users;
DROP POLICY IF EXISTS "update_avatar_policy" ON public.users;

-- Crear nuevas políticas simples y seguras
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
;
