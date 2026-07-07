import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Users, Building2, ChevronLeft, ChevronRight, Gift } from "lucide-react";

const UPCOMING_HOLIDAYS = [
  { date: "Aug 15", name: "Independence Day", type: "national" },
  { date: "Oct 02", name: "Gandhi Jayanti", type: "national" },
  { date: "Oct 20", name: "Diwali", type: "festival" },
  { date: "Oct 21", name: "Diwali (Extra)", type: "festival" },
  { date: "Nov 01", name: "Rajyotsava Day", type: "state" },
  { date: "Dec 25", name: "Christmas", type: "festival" },
];

const holidayTypeColors = {
  national: { bg: "bg-red-50",    dot: "bg-red-500",    text: "text-red-600" },
  festival: { bg: "bg-orange-50", dot: "bg-orange-500", text: "text-orange-600" },
  state:    { bg: "bg-purple-50", dot: "bg-purple-500", text: "text-purple-600" },
};

function Dashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, totalDepartments: 0 });
  const [role, setRole] = useState("employee");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.role) setRole(payload.role);
      } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (role === "admin" || role === "hr") {
      fetchStats();
    } else {
      fetchMyLeaves(token);
    }
  }, [role]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data.data);
    } catch (err) { /* silently fail */ }
  };

  const fetchMyLeaves = async (token) => {
    try {
      const res = await api.get("/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const leaves = res.data?.data || [];
      setApprovedLeaves(leaves.filter((l) => l.status === "Approved"));
    } catch (err) { /* silently fail */ }
  };

  const isAdmin = role === "admin" || role === "hr";

  // Helper: find approved leave for a specific date
  const getLeaveForDate = (year, month, day) => {
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    return approvedLeaves.find((leave) => {
      const start = new Date(leave.startDate); start.setHours(0, 0, 0, 0);
      const end   = new Date(leave.endDate);   end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  // Calendar Calculation Logic
  const monthName   = new Date(currentYear, currentMonthIndex, 1).toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay    = new Date(currentYear, currentMonthIndex, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const thisDate = new Date(currentYear, currentMonthIndex, day);
    thisDate.setHours(0, 0, 0, 0);
    const dayOfWeek = (startOffset + day - 1) % 7;
    const isFuture  = thisDate > today;
    const isToday   = thisDate.getTime() === today.getTime();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    let status   = "Present";
    let dotClass = "bg-green-500";
    let boxClass = "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-transparent text-gray-800";

    if (isWeekend) {
      status   = "Weekend";
      dotClass = "bg-gray-300";
      boxClass = "bg-gray-50/50 shadow-inner border border-gray-100 text-gray-400";
    } else if (isFuture) {
      // Future dates: completely empty, no fake status
      status   = "—";
      dotClass = "bg-transparent";
      boxClass = "bg-transparent border border-dashed border-gray-200 text-gray-300 shadow-none";
    } else {
      // Past & today: check real approved leave from DB
      const leave = getLeaveForDate(currentYear, currentMonthIndex, day);
      if (leave) {
        if (leave.leaveType === "Sick") {
          status   = "Sick Leave (SL)";
          dotClass = "bg-yellow-400";
        } else {
          status   = `Leave (${leave.leaveType})`;
          dotClass = "bg-red-500";
        }
      }
    }

    // Today highlight
    if (isToday && !isWeekend) {
      boxClass = "bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.4)] text-white border-transparent";
      dotClass = status === "Present" ? "bg-white" : dotClass;
    }

    calendarDays.push({ day, status, dotClass, boxClass });
  }

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) { setCurrentMonthIndex(11); setCurrentYear(prev => prev - 1); }
    else setCurrentMonthIndex(prev => prev - 1);
  };
  const handleNextMonth = () => {
    if (currentMonthIndex === 11) { setCurrentMonthIndex(0); setCurrentYear(prev => prev + 1); }
    else setCurrentMonthIndex(prev => prev + 1);
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1">
        {/* Top Header */}
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-center px-8 shadow-sm">
           <h2 className="text-2xl font-bold text-gray-800 m-0">Dashboard Overview</h2>
        </div>

        <div className="p-8">
          {isAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-24 h-24 text-blue-600" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <Users className="w-6 h-6" />
                  </div>
                  <h5 className="text-gray-500 font-semibold tracking-wide m-0">Total Employees</h5>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.totalEmployees || 0}</h2>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="w-24 h-24 text-purple-600" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                     <Building2 className="w-6 h-6" />
                  </div>
                  <h5 className="text-gray-500 font-semibold tracking-wide m-0">Total Departments</h5>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">{stats.totalDepartments || 0}</h2>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto w-full">

              {/* Welcome Banner */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-8 text-white mb-6">
                <h3 className="text-3xl font-bold mb-2">Welcome back to the Portal!</h3>
                <p className="text-indigo-100 text-lg">Here is your live attendance and leave summary.</p>
              </div>

              {/* Attendance + Holidays side by side */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* Linear Row-Based Attendance Layout (Original Style) */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex-1">

                  {/* Top Stats */}
                  <div className="flex flex-wrap items-center gap-8 md:gap-12 mb-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {calendarDays.filter(d => d.status === "Present").length}
                        </span>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm"></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-400 mt-1">Total Present</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {calendarDays.filter(d => d.status.startsWith("Leave")).length}
                        </span>
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-400 mt-1">Total Leaves</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {calendarDays.filter(d => d.status === "Sick Leave (SL)").length}
                        </span>
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-400 mt-1">Sick Leaves</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-extrabold text-gray-900">
                          {calendarDays.filter(d => d.status === "Weekend").length}
                        </span>
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-300 shadow-sm"></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-400 mt-1">Weekends</div>
                    </div>
                  </div>

                  {/* Title & Controls */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-t border-gray-50 pt-8 gap-4">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance Summary</h3>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm text-gray-500 hover:text-gray-800">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-extrabold text-gray-800 w-16 text-center">
                          {monthName.substring(0, 3)}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm text-gray-500 hover:text-gray-800">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <select
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="px-4 py-2 bg-gray-50/80 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {[2024, 2025, 2026, 2027].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>

                      <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                        <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-sm font-bold text-gray-800">Monthly</button>
                        <button className="px-4 py-1.5 text-sm font-bold text-gray-400 hover:text-gray-600">Yearly</button>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Month Label */}
                  <h4 className="text-sm font-extrabold text-gray-500 mb-4">{monthName}</h4>

                  {/* Original Linear Flex Calendar */}
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {calendarDays.map((item) => (
                      <div
                        key={item.day}
                        title={`${monthName} ${item.day}, ${currentYear} - ${item.status}`}
                        className={`flex flex-col items-center justify-center w-11 h-14 md:w-12 md:h-16 rounded-[14px] cursor-pointer hover:-translate-y-1 transition-all duration-200 ${item.boxClass}`}
                      >
                        <span className="text-[15px] font-extrabold mb-1">{item.day}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.dotClass}`}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Holidays Box */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full lg:w-72 shrink-0">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Gift className="w-4 h-4 text-orange-500" />
                    </div>
                    <h4 className="text-base font-extrabold text-gray-800">Upcoming Holidays</h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {UPCOMING_HOLIDAYS.map((holiday, i) => {
                      const colors = holidayTypeColors[holiday.type];
                      return (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${colors.bg}`}>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`}></div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-extrabold truncate ${colors.text}`}>{holiday.name}</div>
                            <div className="text-xs text-gray-400 font-semibold mt-0.5">{holiday.date}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;