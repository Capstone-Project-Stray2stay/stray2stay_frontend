import axiosInstance from "../axios/axiosInstance";

export interface NotificationResponse {
  id: number;
  type: string;
  title: string;
  message: string;
  petId?: number;
  rehomeId?: number;
  isRead: boolean;
  createdAt: string;
}

export async function getNotificationsAPI(): Promise<{
  notifications: NotificationResponse[];
  unreadCount: number;
}> {
  const res = await axiosInstance.get("/notifications");
  if (res.status === 200) {
    return {
      notifications: res.data.notifications ?? [],
      unreadCount: res.data.unreadCount ?? 0,
    };
  }
  throw new Error("Failed to fetch notifications");
}

export async function markNotificationReadAPI(notificationID: number): Promise<void> {
  const res = await axiosInstance.put(`/notifications/${notificationID}/read`);
  if (res.status !== 200) {
    throw new Error("Failed to mark notification as read");
  }
}

export async function markAllNotificationsReadAPI(): Promise<void> {
  const res = await axiosInstance.put("/notifications/read-all");
  if (res.status !== 200) {
    throw new Error("Failed to mark notifications as read");
  }
}
