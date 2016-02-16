CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  data TEXT
);

CREATE TABLE subscriptions (
  endpoint TEXT,
  subscription_id TEXT,
  UNIQUE (endpoint, subscription_id)
);
