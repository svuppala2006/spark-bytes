import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface NotificationPreference {
  user_id: string;
  notifications_enabled: boolean;
  updated_at: string;
}

export interface NewEventNotification {
  id: number;
  name: string;
  organization: string;
  date: string;
  start_time: string;
  location: string;
}

export function useNotifications(userId: string | null) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch current notification preference
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchPreference() {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows found, which is expected for new users
          console.error('Error fetching notification preference:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setNotificationsEnabled(data.notifications_enabled);
        } else {
          // Create default preference for new users (disabled by default)
          await supabase
            .from('notification_preferences')
            .insert([
              {
                user_id: userId,
                notifications_enabled: false,
                updated_at: new Date().toISOString(),
              },
            ]);
          setNotificationsEnabled(false);
        }
      } catch (error) {
        console.error('Error in fetchPreference:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreference();
  }, [userId]);

  // Subscribe to new events in realtime
  useEffect(() => {
    if (!userId || !notificationsEnabled) {
      console.log('[Notifications] Skipping subscription:', { userId, notificationsEnabled });
      return;
    }

    console.log('[Notifications] Starting realtime subscription for user:', userId);

    // Subscribe to the Events table for INSERT events (capital E!)
    const subscription = supabase
      .channel(`Events:public:inserts`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Events',
        },
        (payload) => {
          console.log('[Notifications] 🎉 RECEIVED REALTIME EVENT:', payload.new);
          // Show notification for new event
          const newEventData = payload.new as NewEventNotification;
          setNewEvent(newEventData);
          // Auto-dismiss after 10 seconds
          setTimeout(() => setNewEvent(null), 10000);
        }
      )
      .subscribe((status) => {
        console.log('[Notifications] ===== SUBSCRIPTION STATUS CHANGED:', status, '=====');
        if (status === 'SUBSCRIBED') {
          console.log('[Notifications] ✅ SUBSCRIBED - Ready to receive realtime events');
        } else if (status === 'CLOSED') {
          console.log('[Notifications] ❌ CLOSED - No longer listening');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('[Notifications] ⚠️  CHANNEL_ERROR - Something went wrong');
        }
      });

    unsubscribeRef.current = () => {
      console.log('[Notifications] Unsubscribing');
      subscription.unsubscribe();
    };

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId, notificationsEnabled]);

  const toggleNotifications = useCallback(
    async (enabled: boolean) => {
      if (!userId) return;

      try {
        const { error } = await supabase
          .from('notification_preferences')
          .update({
            notifications_enabled: enabled,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating notification preference:', error);
          return;
        }

        setNotificationsEnabled(enabled);
      } catch (error) {
        console.error('Error in toggleNotifications:', error);
      }
    },
    [userId]
  );

  return {
    notificationsEnabled,
    newEvent,
    setNewEvent,
    toggleNotifications,
    loading,
  };
}
