import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useGetProfileQuery } from "../store/apiSlice";
import NotificationBell from "./NotificationBell";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ReceiptText, 
  CalendarDays, 
  LogOut
} from "lucide-react";

function Sidebar() {
  const token = localStorage.getItem("token");
  let role = "employee";
  let userId = "";
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { data: profileResponse } = useGetProfileQuery(undefined, { skip: !token });
  const profile = profileResponse?.data;
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && payload.role) role = payload.role;
      if (payload && payload.id) userId = payload.id;
    } catch (e) {
      // token malformed, default role remains
    }
  }

  const isAdmin = role === "admin" || role === "hr";
  const empId = userId ? `EMP-${userId.substring(18).toUpperCase()}` : "EMP-0000";
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ...(isAdmin ? [
      { name: "Employees", path: "/employees", icon: Users },
      { name: "Departments", path: "/departments", icon: Building2 },
    ] : []),
    { name: isAdmin ? "Payroll" : "My Payslips", path: "/payroll", icon: ReceiptText },
    { name: "Leave", path: "/leave", icon: CalendarDays },
  ];

  return (
    <div className="bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm" style={{ width: "260px", minHeight: "100vh" }}>
      {/* Brand Logo & Profile */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-blue-600 tracking-tight m-0">HRMS</h3>
          {!isAdmin && (
            <NotificationBell userId={userId} token={token} />
          )}
        </div>
        
        {profile && (
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                {profile.name?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-gray-900 truncate">{profile.name}</div>
                <div className="text-xs font-semibold text-blue-600 mt-0.5">{empId}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{profile.designation || (isAdmin ? "Administrator" : "Employee")}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-4 mb-2">Main Menu</div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent font-medium transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;