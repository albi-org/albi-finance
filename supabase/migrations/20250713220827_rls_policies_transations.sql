CREATE POLICY "Allow authenticated users to access their own records" 
ON public.transactions
FOR ALL
TO authenticated
USING (auth.uid() = transactions.user_id);