CREATE POLICY "Allow authenticated users to access their own records" 
ON public.periods
FOR ALL
TO authenticated
USING (auth.uid() = periods.user_id);