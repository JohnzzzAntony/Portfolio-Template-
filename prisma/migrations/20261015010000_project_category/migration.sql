-- Project pages show a short category descriptor in the meta list.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT '';
