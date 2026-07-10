import { useState } from "react";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left side: Premium Branding & Illustration Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 p-16 flex-col justify-between relative overflow-hidden">
        {/* Dynamic Abstract Shapes (Glassmorphism / 3D feel) */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 blur-3xl"></div>
        
        {/* Top Logo */}
        <div className="relative z-10">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">HRMS Portal</span>
        </div>

        {/* Hero Visual Card (Glassmorphism) */}
        <div className="relative z-10 my-auto max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Secure Portal
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Empower your workforce, streamline workspace.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Access real-time employee directories, leave requests, attendance history, and automated payroll operations in one single unified hub.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">AS</div>
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">SS</div>
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">DS</div>
              </div>
              <div className="text-xs text-slate-400 font-semibold flex items-center">
                Trusted by 50+ Enterprises
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 text-slate-500 text-xs font-medium flex justify-between">
          <span>© 2026 HRMS System</span>
          <span>All rights reserved</span>
        </div>
      </div>

      {/* Right side: Login Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative">
        <div className="absolute top-10 right-10 md:hidden">
          <span className="text-xl font-extrabold text-blue-600">HRMS</span>
        </div>

        <div className="w-full max-w-[420px] flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium">Please enter your credentials to log in.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                placeholder="you@company.com"
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">Password</label>
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all"
                placeholder="••••••••"
                onChange={handleChange}
                style={{ borderRadius: "10px" }}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 mt-0.5">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 font-semibold cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.97] hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 text-sm uppercase tracking-wider"
              style={{ borderRadius: "12px" }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;