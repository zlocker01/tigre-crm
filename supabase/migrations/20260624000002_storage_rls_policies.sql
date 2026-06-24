-- Storage buckets and RLS policies for public assets and user avatars.

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('landing-images', 'landing-images', true),
  ('avatars', 'avatars', true),
  ('employees-images', 'employees-images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public can read landing images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can read employee images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload landing images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update landing images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete landing images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload employee images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update employee images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete employee images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

CREATE POLICY "Public can read landing images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'landing-images');

CREATE POLICY "Public can read avatars"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Public can read employee images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'employees-images');

CREATE POLICY "Staff can upload landing images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'landing-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Staff can update landing images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'landing-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  )
  WITH CHECK (
    bucket_id = 'landing-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Staff can delete landing images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'landing-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Staff can upload employee images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'employees-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Staff can update employee images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'employees-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  )
  WITH CHECK (
    bucket_id = 'employees-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Staff can delete employee images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'employees-images'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role = ANY (ARRAY['admin', 'empleado'])
    )
  );

CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = ('user_' || auth.uid()::text)
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = ('user_' || auth.uid()::text)
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = ('user_' || auth.uid()::text)
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = ('user_' || auth.uid()::text)
  );
