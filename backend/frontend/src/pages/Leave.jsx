import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { CalendarDays, Plus, Check, X, AlertCircle, CheckCircle } from "lucide-react";

function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("employee");
  const [userId, setUserId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [remarksModal, setRemarksModal] = useState(null); // { id, status }
  const [remarksText, setRemarksText] = useState("");
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Form State
  const [form, setForm] = useState({
    employee: "",
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    totalDays: 1,
    reason: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload && payload.role) setRole(payload.role);
        setUserId(payload.id);
      } catch (e) {
        // failed parsing
      }

      // Fetch actual employee profile ID
      const fetchProfile = async () => {
        try {
          const res = await api.get("/employees/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.data?._id) {
            setEmployeeId(res.data.data._id);
            setForm((prev) => ({ ...prev, employee: res.data.data._id }));
          }
        } catch (err) {
          console.error("Error fetching employee profile:", err);
        }
      };
      fetchProfile();
    }
  }, [token]);

  const isAdmin = role === "admin" || role === "hr";

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Handle page-based API wrapper
      const list = res.data.data || res.data || [];
      setEmployees(list);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leaves", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Leave request submitted successfully!", "success");
      setShowApplyModal(false);
      setForm({
        employee: employeeId,
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        totalDays: 1,
        reason: "",
      });
      fetchLeaves();
    } catch (err) {
      showToast("Failed to submit: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleStatusChange = (id, status) => {
    setRemarksText("");
    setRemarksModal({ id, status });
  };

  const submitStatusChange = async () => {
    if (!remarksModal) return;
    const { id, status } = remarksModal;
    try {
      await api.put(`/leaves/${id}/status`, {
        status,
        remarks: remarksText,
        approvedBy: userId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(`Leave request ${status.toLowerCase()} successfully!`, "success");
      setRemarksModal(null);
      fetchLeaves();
    } catch (err) {
      showToast("Failed to update: " + (err.response?.data?.message || err.message), "error");
    }
  };

  // Filter leaves based on role
  const displayedLeaves = isAdmin
    ? leaves
    : leaves.filter((leave) => {
        const empId = leave.employee?._id || leave.employee;
        return empId === employeeId;
      });

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans">
      <Sidebar />
      <div className="flex-1 relative">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-fade-in ${
            toast.type === "success"
              ? "bg-white border-green-200 text-green-700"
              : "bg-white border-red-200 text-red-700"
          }`}>
            {toast.type === "success"
              ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Header */}
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 m-0">Leave Management</h2>
          {!isAdmin && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Apply Leave
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 max-w-6xl mx-auto w-full">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Pending Approvals</h5>
                <h2 className="text-2xl font-extrabold text-gray-800">{displayedLeaves.filter(l => l.status === "Pending").length}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Approved Requests</h5>
                <h2 className="text-2xl font-extrabold text-gray-800">{displayedLeaves.filter(l => l.status === "Approved").length}</h2>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <X className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Rejected Requests</h5>
                <h2 className="text-2xl font-extrabold text-gray-800">{displayedLeaves.filter(l => l.status === "Rejected").length}</h2>
              </div>
            </div>
          </div>

          {/* Leaves Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 m-0">
                {isAdmin ? "Employee Leave Requests" : "My Leave History"}
              </h3>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  {isAdmin && <th className="p-4 font-bold">Employee</th>}
                  <th className="p-4 font-bold">Leave Type</th>
                  <th className="p-4 font-bold">Duration</th>
                  <th className="p-4 font-bold">Days</th>
                  <th className="p-4 font-bold">Reason</th>
                  <th className="p-4 font-bold">Remarks</th>
                  <th className="p-4 font-bold">Status</th>
                  {isAdmin && <th className="p-4 font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 6} className="p-8 text-center text-gray-400 text-sm">
                      Loading leave records...
                    </td>
                  </tr>
                ) : displayedLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 6} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
                        <span className="text-sm font-semibold">No leave requests found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedLeaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                      {isAdmin && (
                        <td className="p-4">
                          <div className="font-bold text-gray-800">{leave.employee?.name || leave.employee?.firstName || "Unknown"}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{leave.employee?.email}</div>
                        </td>
                      )}
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-semibold">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-800 font-extrabold">{leave.totalDays}</td>
                      <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={leave.remarks || "No remarks"}>
                        {leave.remarks ? (
                          <span className="italic text-gray-600">{leave.remarks}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                            leave.status === "Approved"
                              ? "bg-green-50 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="p-4">
                          {leave.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(leave._id, "Approved")}
                                className="p-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(leave._id, "Rejected")}
                                className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 font-semibold italic">Reviewed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-xl border border-slate-100 relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for Leave</h3>
              
              <form onSubmit={handleApplyLeave} className="flex flex-col gap-4">
                {isAdmin && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Onboard Employee</label>
                    <select
                      name="employee"
                      value={form.employee}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none"
                    >
                      <option value="" disabled>Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name || emp.firstName}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Leave Type</label>
                  <select
                    name="leaveType"
                    value={form.leaveType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none cursor-pointer"
                  >
                    <option value="Casual">Casual Leave (CL)</option>
                    <option value="Earned">Earned / Paid Leave (PL)</option>
                    <option value="Sick">Sick Leave (SL)</option>
                    <option value="Maternity">Maternity Leave</option>
                    <option value="Paternity">Paternity Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Total Days</label>
                  <input
                    type="number"
                    name="totalDays"
                    min="1"
                    value={form.totalDays}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Reason</label>
                  <textarea
                    name="reason"
                    rows="3"
                    value={form.reason}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter reason for leave request..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all text-sm mt-2"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Remarks Modal for Approve / Reject */}
        {remarksModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-slate-100 relative">

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                remarksModal.status === "Approved" ? "bg-green-50" : "bg-red-50"
              }`}>
                {remarksModal.status === "Approved"
                  ? <CheckCircle className="w-7 h-7 text-green-500" />
                  : <X className="w-7 h-7 text-red-500" />
                }
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 text-center mb-1">
                {remarksModal.status === "Approved" ? "Approve Leave" : "Reject Leave"}
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                Add a remark for the employee (optional)
              </p>

              <textarea
                rows="3"
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                placeholder="e.g. Approved, enjoy your leave!"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold bg-gray-50 outline-none resize-none focus:border-blue-300 transition-colors mb-5"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setRemarksModal(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitStatusChange}
                  className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all text-sm ${
                    remarksModal.status === "Approved"
                      ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
                      : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                  }`}
                >
                  {remarksModal.status === "Approved" ? "✓ Approve" : "✗ Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leave;
