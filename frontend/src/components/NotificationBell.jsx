import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, XCircle, X } from "lucide-react";
import api from "../services/api";

function NotificationBell({ userId, token }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const dropdownRef = useRef(null);

  const STORAGE_KEY = `hrms_leave_seen_${userId}`;

  // Step 1: get the real Employee._id first
  useEffect(() => {
    if (!token || !userId) return;

    const fetchEmployeeId = async () => {
      try {
        const res = await api.get("/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data?.data || res.data || [];
        // Find the employee whose userId matches by email via profile
        // Fallback: fetch profile endpoint
        const profileRes = await api.get("/employees/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const empId = profileRes.data?.data?._id;
        if (empId) setEmployeeId(empId);
      } catch (err) {
        // If profile fails, try matching from employees list
        try {
          const res = await api.get("/employees", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = res.data?.data || [];
          // We can't match by userId directly, so just skip
          // Notifications will show all approved leaves as fallback
          if (list.length > 0) setEmployeeId("__all__");
        } catch (e) {
          // silently fail
        }
      }
    };

    fetchEmployeeId();
  }, [token, userId]);

  // Step 2: once we have employeeId, fetch and compare leaves
  useEffect(() => {
    if (!token || !employeeId) return;
    fetchAndCompareLeaves();
  }, [token, employeeId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAndCompareLeaves = async () => {
    try {
      const res = await api.get("/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allLeaves = res.data?.data || [];

      // Filter resolved leaves for this employee
      const resolvedLeaves = allLeaves.filter((leave) => {
        if (leave.status === "Pending") return false;
        if (employeeId === "__all__") return true;
        const empField = leave.employee?._id || leave.employee;
        return empField === employeeId;
      });

      const seenRaw = localStorage.getItem(STORAGE_KEY);
      const seenMap = seenRaw ? JSON.parse(seenRaw) : {};

      const allNotifs = resolvedLeaves.map((leave) => ({
        id: leave._id,
        status: leave.status,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        isRead: seenMap[leave._id] === leave.status,
      }));

      setNotifications(allNotifs.reverse());
      setUnreadCount(allNotifs.filter((n) => !n.isRead).length);
    } catch (err) {
      // silently fail
    }
  };

  const markAllRead = () => {
    const seenRaw = localStorage.getItem(STORAGE_KEY);
    const seenMap = seenRaw ? JSON.parse(seenRaw) : {};
    notifications.forEach((n) => { seenMap[n.id] = n.status; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seenMap));
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && unreadCount > 0) markAllRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-full ml-3 top-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h4 className="text-sm font-extrabold text-gray-800">Notifications</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 transition-colors ${
                    !notif.isRead ? "bg-blue-50/40" : "bg-white"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {notif.status === "Approved"
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <XCircle className="w-5 h-5 text-red-500" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {notif.leaveType} Leave{" "}
                      <span className={`font-extrabold ${notif.status === "Approved" ? "text-green-600" : "text-red-600"}`}>
                        {notif.status}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(notif.startDate)} – {formatDate(notif.endDate)}
                    </p>
                    {!notif.isRead && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center font-semibold">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
