
-- Allow anonymous users to update product stock (for customer checkout)
CREATE POLICY "Anyone can update product stock" ON public.products
FOR UPDATE USING (true) WITH CHECK (true);
