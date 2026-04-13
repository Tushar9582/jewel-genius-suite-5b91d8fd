import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  icon: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.uid)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setNotifications(data as Notification[]);
    setLoading(false);
  }, [user]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.uid}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          // Play bell sound
          try {
            bellAudioRef.current?.play();
          } catch {}
          toast({
            title: newNotif.title,
            description: newNotif.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications, toast]);

  const markAsRead = useCallback(
    async (id: string) => {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.uid)
      .eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, [user]);

  const clearAll = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .delete()
      .eq("user_id", user.uid);
    setNotifications([]);
  }, [user]);

  const createNotification = useCallback(
    async (data: {
      title: string;
      message: string;
      type: string;
      priority?: string;
      icon?: string;
      action_url?: string;
    }) => {
      if (!user) return;
      await supabase.from("notifications").insert({
        user_id: user.uid,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority || "low",
        icon: data.icon || null,
        action_url: data.action_url || null,
      });
    },
    [user]
  );

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAll,
    createNotification,
    bellAudioRef,
  };
}
