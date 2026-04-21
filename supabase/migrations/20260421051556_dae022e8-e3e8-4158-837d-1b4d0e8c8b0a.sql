
-- Devices table
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  name text not null default 'ESP32-CAM',
  is_online boolean not null default false,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);

-- Sensor readings table
create table public.sensor_readings (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  soil_moisture numeric,
  temperature numeric,
  humidity numeric,
  light_intensity numeric,
  recorded_at timestamptz not null default now()
);
create index idx_sensor_readings_recorded_at on public.sensor_readings (recorded_at desc);
create index idx_sensor_readings_device on public.sensor_readings (device_id);

-- Disease predictions table
create table public.disease_predictions (
  id uuid primary key default gen_random_uuid(),
  device_id text,
  image_path text not null,
  image_url text,
  predicted_class text not null,
  confidence numeric not null,
  is_healthy boolean not null default false,
  recommendation text,
  model_version text default 'cnn-v1',
  created_at timestamptz not null default now()
);
create index idx_predictions_created_at on public.disease_predictions (created_at desc);

-- Enable RLS
alter table public.devices enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.disease_predictions enable row level security;

-- For demo: allow public read access (dashboard is publicly viewable)
create policy "Public can read devices" on public.devices for select using (true);
create policy "Public can read sensor readings" on public.sensor_readings for select using (true);
create policy "Public can read predictions" on public.disease_predictions for select using (true);

-- Storage bucket for leaf images (public so dashboard can display them)
insert into storage.buckets (id, name, public) values ('leaf-images', 'leaf-images', true);

create policy "Public can read leaf images"
  on storage.objects for select
  using (bucket_id = 'leaf-images');
