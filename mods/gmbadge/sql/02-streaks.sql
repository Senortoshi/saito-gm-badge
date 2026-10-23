CREATE TABLE IF NOT EXISTS streaks (
  publickey TEXT PRIMARY KEY,
  first_block INTEGER,
  current INTEGER DEFAULT 0,
  longest INTEGER DEFAULT 0,
  lifetime INTEGER DEFAULT 0,
  first_day INTEGER,
  last_day INTEGER,
  updated INTEGER DEFAULT 0
);
