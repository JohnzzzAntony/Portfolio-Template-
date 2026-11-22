-- Optional project film (silent MP4) shown on the case-study page.
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT NOT NULL DEFAULT '';
