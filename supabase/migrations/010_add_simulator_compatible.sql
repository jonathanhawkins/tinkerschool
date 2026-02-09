-- =============================================================================
-- TinkerSchool -- Add simulator_compatible column to lessons
-- =============================================================================
-- Adds a `simulator_compatible` boolean column to the lessons table that
-- explicitly marks whether a lesson can be fully completed using only the
-- browser-based simulator (no physical M5StickC Plus 2 device needed).
--
-- This is separate from the existing `simulator_support` column which
-- indicates whether the simulator can *run* the lesson code at all. The new
-- `simulator_compatible` column indicates whether the *learning goals* of the
-- lesson can be achieved without hardware.
--
-- Default: true (most display/buzzer/button lessons work fine in the sim).
-- Set to false for lessons that rely heavily on physical interaction (IMU
-- shaking/tilting, GPIO, IR transmitter, WiFi, or microphone).
--
-- Depends on:
--   - 001_initial_schema.sql       (lessons table)
--   - 002_tinkerschool_multi_subject.sql (device_features column)
-- =============================================================================

-- Add the column with a sensible default
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS simulator_compatible boolean NOT NULL DEFAULT true;

-- ---------------------------------------------------------------------------
-- Update existing lessons based on device_features
-- ---------------------------------------------------------------------------
-- Lessons that primarily use display, buzzer, and buttons are simulator-ready.
-- Lessons that depend on IMU (physical shaking/tilting), GPIO, IR, WiFi, or
-- microphone require hardware for the full learning experience.

-- Mark lessons requiring IMU-heavy interaction as hardware-needed.
-- These lessons depend on physical motion (shake detection, tilt sensing).
UPDATE public.lessons
SET simulator_compatible = false
WHERE 'imu' = ANY(device_features)
  AND NOT ('display' = ANY(device_features) AND array_length(device_features, 1) = 1);

-- Mark lessons requiring GPIO, IR, WiFi, or microphone as hardware-needed.
UPDATE public.lessons
SET simulator_compatible = false
WHERE device_features && ARRAY['gpio', 'ir', 'ir_transmitter', 'wifi', 'microphone'];

-- Ensure display-only and display+buzzer lessons remain simulator-compatible.
-- (This is the default, but explicit for clarity.)
UPDATE public.lessons
SET simulator_compatible = true
WHERE device_features <@ ARRAY['display', 'buzzer', 'buttons']
  AND simulator_compatible = false;
