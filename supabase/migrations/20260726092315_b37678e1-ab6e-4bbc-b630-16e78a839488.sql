ALTER TABLE public.sensor_readings REPLICA IDENTITY FULL;
ALTER TABLE public.devices REPLICA IDENTITY FULL;
ALTER TABLE public.disease_predictions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.disease_predictions;
CREATE INDEX IF NOT EXISTS sensor_readings_recorded_at_idx ON public.sensor_readings (recorded_at DESC);
CREATE INDEX IF NOT EXISTS disease_predictions_created_at_idx ON public.disease_predictions (created_at DESC);