import { createContext, useCallback, useEffect, useState } from "react";
import restClient from "../services/restClient";
import { useSelector } from "react-redux";

export const NotificationContext = createContext();

export default function NotifyProvider({ children }) {
  const [numberOfNotification, setNumberOfNotification] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user.value);
  const fetchNumberNotificationByUserId = useCallback(() => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/getnumberofnotificationbyuser/${user?.sub}`,
        method: "GET",
      })
        .then((res) => {
          setNumberOfNotification(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user]);
  const fetchListNotificationByUserId = useCallback(() => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/getallnotificationbyuser/${user?.sub}`,
        method: "GET",
      })
        .then((res) => {
          setNotifications(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user]);
  useEffect(() => {
    fetchNumberNotificationByUserId();
  }, [fetchNumberNotificationByUserId]);
  return (
    <NotificationContext.Provider
      value={{
        fetchNumberNotificationByUserId,
        numberOfNotification,
        fetchListNotificationByUserId,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
