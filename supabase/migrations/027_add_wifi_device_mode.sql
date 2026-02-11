-- =============================================================================
-- TinkerSchool -- Add 'wifi' to device_mode CHECK constraint
-- =============================================================================
-- Adds WiFi WebREPL as a device connection mode alongside USB and simulator.
-- Tablets (Amazon Fire, iPads) use WiFi since they lack Web Serial API.
-- =============================================================================

-- Drop the existing CHECK constraint and recreate with 'wifi' included.
-- The constraint name follows Postgres auto-naming: {table}_{column}_check
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_device_mode_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_device_mode_check
    CHECK (device_mode IN ('usb', 'wifi', 'simulator', 'none'));
