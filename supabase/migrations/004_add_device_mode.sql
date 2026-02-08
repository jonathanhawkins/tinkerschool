-- =============================================================================
-- TinkerSchool -- Add device_mode column to profiles
-- =============================================================================
-- Tracks how the kid connects to their M5StickC Plus 2 during onboarding:
--   'usb'       -- connected via USB serial (Web Serial API)
--   'simulator'  -- using the browser-based simulator
--   'none'       -- hasn't set up a device yet
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN device_mode text NOT NULL DEFAULT 'none'
    CHECK (device_mode IN ('usb', 'simulator', 'none'));
