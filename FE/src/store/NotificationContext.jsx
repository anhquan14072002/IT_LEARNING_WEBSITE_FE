import { createContext, useCallback, useEffect, useState } from "react";
import restClient from "../services/restClient";
import { useSelector } from "react-redux";

export const NotificationContext = createContext();

export default function NotifyProvider({ children }) {
  const [numberOfNotification, setNumberOfNotification] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState();
  const user = useSelector((state) => state.user.value);
  const [rows, setRows] = useState(6);
  const [activeTabIndex, setTabIndex] = useState(0);
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
  }, [user, refresh]);
  const fetchListNotificationByUserId = useCallback(() => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/getallnotificationbyuser/${user?.sub}?PageIndex=1&PageSize=${rows}`,
        method: "GET",
      })
        .then((res) => {
          setNotifications(res.data.data);
          console.log(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user?.sub, refresh, rows]);
  const fetchListNotificationNotRead = useCallback(() => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/getallnotificationnotreadbyuser?userId=${user?.sub}&PageIndex=1&PageSize=${rows}`,
        method: "GET",
      })
        .then((res) => {
          setNotifications(res.data.data);
          console.log(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user?.sub, refresh, rows]);
  const deleteallnotificationbyuser = useCallback(() => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/deleteallnotificationbyuser/${user?.sub}`,
        method: "DELETE",
      })
        .then((res) => {
          setNotifications(res.data.data);
          setRefresh(new Date());
          console.log(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user?.sub, refresh]);
  const markallasreadasync = () => {
    if (user?.sub) {
      restClient({
        url: `api/notifications/markallasreadasync?userId=${user?.sub}`,
        method: "POST",
      })
        .then((res) => {
          setRefresh(new Date());
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  };
  useEffect(() => {
    fetchNumberNotificationByUserId();
  }, [fetchNumberNotificationByUserId]);
  useEffect(() => {
    if (activeTabIndex === 0) {
      fetchListNotificationByUserId();
    } else {
      fetchListNotificationNotRead();
    }
  }, [fetchListNotificationByUserId, activeTabIndex]);
  return (
    <NotificationContext.Provider
      value={{
        fetchNumberNotificationByUserId,
        numberOfNotification,
        fetchListNotificationByUserId,
        notifications,
        markallasreadasync,
        deleteallnotificationbyuser,
        fetchListNotificationNotRead,
        setRows,
        setTabIndex,
        activeTabIndex,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
