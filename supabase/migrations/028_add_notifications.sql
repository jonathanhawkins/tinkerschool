-- =============================================================================
-- Migration: Add notifications table for parent alerts
-- =============================================================================
-- Stores notification records when significant events happen (lesson
-- completion, badge earned, streak milestones, etc.). This table serves as
-- the foundation for email/push notifications -- records are inserted
-- immediately, and a future cron job or webhook processor will handle
-- delivery via Resend/SendGrid.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who this notification belongs to
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  recipient_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- The kid who triggered the notification (nullable for system notifications)
  kid_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Notification content
  type text NOT NULL CHECK (type IN (
    'lesson_completed',
    'badge_earned',
    'streak_milestone',
    'level_up',
    'system'
  )),
  title text NOT NULL,
  body text NOT NULL,

  -- Extra structured data (lesson name, subject, score, etc.)
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  -- Read/delivery status
  read boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fetching a parent's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
  ON public.notifications (recipient_profile_id, created_at DESC)
  WHERE read = false;

-- Index for fetching all notifications for a family
CREATE INDEX IF NOT EXISTS idx_notifications_family
  ON public.notifications (family_id, created_at DESC);

-- Index for the email delivery queue (unprocessed notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_email_queue
  ON public.notifications (created_at ASC)
  WHERE email_sent = false;

-- RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Parents can read notifications addressed to them
CREATE POLICY "Parents can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (
    recipient_profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = auth.uid()
    )
  );

-- Parents can mark their own notifications as read
CREATE POLICY "Parents can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (
    recipient_profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = auth.uid()
    )
  )
  WITH CHECK (
    recipient_profile_id IN (
      SELECT id FROM public.profiles WHERE clerk_id = auth.uid()
    )
  );

-- Service role has full access (for server actions inserting notifications)
CREATE POLICY "Service role full access to notifications"
  ON public.notifications
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
