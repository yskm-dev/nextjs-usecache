CREATE TABLE IF NOT EXISTS revalidations (
  tag TEXT NOT NULL,
  revalidatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_revalidations_tag ON revalidations(tag);
CREATE INDEX IF NOT EXISTS idx_revalidations_revalidated_at ON revalidations(revalidatedAt);
