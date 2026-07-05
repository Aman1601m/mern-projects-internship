import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { Users, Building2, ChevronLeft, ChevronRight, Gift } from "lucide-react";

const UPCOMING_HOLIDAYS = [
  { date: "Jul 06", name: "Sunday Holiday", type: "weekend" },
  { date: "Aug 15", name: "Independence Day", type: "national" },
  { date: "Oct 02", name: "Gandhi Jayanti", type: "national" },
  { date: "Oct 20", name: "Diwali", type: "festival" },
  { date: "Oct 21", name: "Diwali (Extra)", type: "festival" },
  { date: "Nov 01", name: "Rajyotsava Day", type: "state" },
  { date: "Dec 25", name: "Christmas", type: "festival" },
];

const holidayTypeColors = {
  national: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-600" },
  festival: { bg: "bg-orange-50", dot: "bg-orange-500", text: "text-orange-600" },
  state:    { bg: "bg-purple-50", dot: "bg-purple-500", text: "text-purple-600" },
  weekend:  { bg: "bg-gray-50",  dot: "bg-gray-400",   text: "text-gray-500" },
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
  });
  const [role, setRole] = useState("employee");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.role) {
          setRole(payload.role);
        }
      } catch (e) {
        // token malformed, default role remains
      }
    }
  }, []);

  useEffect(() => {
    if (role === "admin" || role === "hr") {
      fetchStats();
    }
  }, [role]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/employees/dashboard/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data.data);
    } catch (err) {
      // silently fail - stats are non-critical
    }
  };

  const isAdmin = role === "admin" || role === "hr";

  // Calendar Calculation Logic
  const monthName = new Date(currentYear, currentMonthIndex, 1).toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const calendarDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    let dayOfYear = 0;
    for (let m = 0; m < currentMonthIndex; m++) {
      dayOfYear += new Date(currentYear, m + 1, 0).getDate();
    }
    dayOfYear += day;
    const dayOfWeek = (startOffset + day - 1) % 7;
    
    let status = "Present";
    let dotClass = "bg-green-500";
    let boxClass = "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-transparent text-gray-800";
    
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      status = "Weekend";
      dotClass = "bg-gray-300";
      boxClass = "bg-gray-50/50 shadow-inner border border-gray-100 text-gray-400";
    } else if ((dayOfYear % 37 === 0) || (dayOfYear % 89 === 0)) {
      status = "Sick Leave (SL)";
      dotClass = "bg-yellow-400";
    } else if ((dayOfYear % 42 === 0) || (dayOfYear % 61 === 0)) {
      status = "Leave (CL/PL)";
      dotClass = "bg-red-500";
    } else if (currentYear >= 2026 && currentMonthIndex > 6) { 
      status = "Upcoming";
      dotClass = "bg-gray-200";
      boxClass = "bg-transparent border border-dashed border-gray-200 text-gray-300 shadow-none";
    }
    
    calendarDays.push({ day, status, dotClass, boxClass });
  }

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1">
        {/* Top Header Placeholder */}
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

             {/* Mock Leave Balances */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                 <h5 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Casual Leave (CL)</h5>
                 <h2 className="text-4xl font-extrabold text-gray-800 mb-2">4 <span className="text-lg text-gray-400 font-medium">left</span></h2>
                 <div className="text-xs text-gray-500">Allowed: 6 | Taken: 2</div>
               </div>

               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                 <h5 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Paid Leave (PL)</h5>
                 <h2 className="text-4xl font-extrabold text-gray-800 mb-2">12 <span className="text-lg text-gray-400 font-medium">left</span></h2>
                 <div className="text-xs text-gray-500">Accrued: 15 | Taken: 3</div>
               </div>

               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                 <h5 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Sick Leave (SL)</h5>
                 <h2 className="text-4xl font-extrabold text-gray-800 mb-2">11 <span className="text-lg text-gray-400 font-medium">left</span></h2>
                 <div className="text-xs text-gray-500">Allowed: 12 | Taken: 1</div>
               </div>

               <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-b-4 border-b-green-500 hover:shadow-md transition-shadow">
                 <h5 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Remaining</h5>
                 <h2 className="text-4xl font-extrabold text-green-600 mb-2">27 <span className="text-lg text-gray-400 font-medium">days</span></h2>
                 <div className="text-xs text-gray-500">Total Available in 2026</div>
               </div>
             </div>

             {/* Attendance + Holidays side by side */}
             <div className="flex flex-col lg:flex-row gap-6 items-start">
             {/* Linear Row-Based Attendance Layout (New Style) */}
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex-1">
               
               {/* Top Stats - Like the Image */}
               <div className="flex flex-wrap items-center gap-8 md:gap-12 mb-10">
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-4xl font-extrabold text-gray-900">{calendarDays.filter(d => d.status === "Present").length}</span>
                     <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm"></div>
                   </div>
                   <div className="text-sm font-semibold text-gray-400 mt-1">Total Present</div>
                 </div>
                 
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-4xl font-extrabold text-gray-900">{calendarDays.filter(d => d.status === "Leave (CL/PL)").length}</span>
                     <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></div>
                   </div>
                   <div className="text-sm font-semibold text-gray-400 mt-1">Total Leaves</div>
                 </div>

                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-4xl font-extrabold text-gray-900">{calendarDays.filter(d => d.status === "Sick Leave (SL)").length}</span>
                     <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
                   </div>
                   <div className="text-sm font-semibold text-gray-400 mt-1">Sick Leaves</div>
                 </div>

                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-4xl font-extrabold text-gray-900">{calendarDays.filter(d => d.status === "Weekend").length}</span>
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
                       <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm text-gray-500 hover:text-gray-800"><ChevronLeft className="w-4 h-4" /></button>
                       <span className="text-sm font-extrabold text-gray-800 w-16 text-center">{monthName.substring(0,3)}</span>
                       <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg transition-all shadow-sm text-gray-500 hover:text-gray-800"><ChevronRight className="w-4 h-4" /></button>
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

               {/* Linear Calendar Grid */}
               <h4 className="text-sm font-extrabold text-gray-500 mb-4">{monthName}</h4>
               
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