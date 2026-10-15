-- The site is a single-owner personal portfolio, so the customer purchase
-- platform is gone. All three tables were verified empty (0 rows) before this
-- migration was written, so no user data is discarded.
DROP TABLE IF EXISTS "Purchase";
DROP TABLE IF EXISTS "PaymentEvent";
DROP TABLE IF EXISTS "Portfolio";
