CREATE POLICY "Anyone can read apks" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'apks');
CREATE POLICY "Admins upload apks" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'apks' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update apks" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'apks' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete apks" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'apks' AND public.has_role(auth.uid(), 'admin'));