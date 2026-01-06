-- Enable RLS
ALTER TABLE "ImportLog" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view their own logs
CREATE POLICY "Enable select for users based on createdBy" ON "ImportLog"
FOR SELECT TO authenticated
USING (auth.uid()::text = "createdBy");

-- Policy: Allow authenticated users to insert logs (e.g. via client or server action context)
CREATE POLICY "Enable insert for authenticated users" ON "ImportLog"
FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = "createdBy");

-- Policy: Service Role gets full access (implicit usually, but good to be explicit if using Supabase client)
-- Note: Prisma usually connects as postgres (superuser) which bypasses RLS, but if using connection pooler with distinct roles:
-- grant all on "ImportLog" to service_role;
