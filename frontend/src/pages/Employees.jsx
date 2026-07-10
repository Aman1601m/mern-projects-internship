import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Trash2 } from "lucide-react";
import { useGetEmployeesQuery, useAddEmployeeMutation, useDeleteEmployeeMutation } from "../store/apiSlice";
import api from "../services/api";

function Employees() {
  const { data: response, isLoading, isError } = useGetEmployeesQuery();
  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [form, setForm] = useState({ name: "", email: "", mobileNumber: "", designation: "", department: "", salary: "", joiningDate: "" });
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.data);
      } catch (err) {
        // departments failed to load
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nameParts = form.name.trim().split(" ");
      const payload = {
        ...form,
        firstName: nameParts[0] || "Employee",
        lastName: nameParts.slice(1).join(" ") || "Name",
        phone: form.mobileNumber,
        employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`, // random 4 digit ID
      };
      
      const res = await addEmployee(payload).unwrap();
      setForm({ name: "", email: "", mobileNumber: "", designation: "", department: "", salary: "", joiningDate: "" });
      showNotification(res.message || "Employee onboarded successfully!", "success");
    } catch (err) {
      showNotification("Failed to add employee: " + (err.data?.message || err.error), "error");
    }
  };

  const handleResetPassword = async (id, name) => {
    const newPassword = window.prompt(`Enter new password for ${name}:`);
    if (newPassword === null) return; // User cancelled
    if (newPassword.trim().length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      const res = await api.put(`/employees/${id}/reset-password`, { password: newPassword });
      showNotification(res.data.message || "Password reset successfully!", "success");
    } catch (err) {
      showNotification("Failed to reset password: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to completely delete ${name} from the system? This cannot be undone.`)) return;
    try {
      await deleteEmployee(id).unwrap();
      showNotification(`${name} was successfully removed from the system.`, "success");
    } catch (err) {
      showNotification("Failed to delete employee: " + (err.data?.message || err.error), "error");
    }
  };

  const employees = response?.data || [];

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-center px-8 shadow-sm">
           <h2 className="text-2xl font-bold text-gray-800 m-0">Employees Management</h2>
        </div>
        <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 border-t-4 border-t-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">1-Click Employee Onboarding</h3>
          <p className="text-sm text-gray-500 mb-4">Adding an employee here automatically creates their HR Profile and generates their User Login Account.</p>
          
          {notification.show && (
            <div className={`p-4 mb-6 rounded-lg font-medium shadow-sm transition-all flex items-center justify-between ${
              notification.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="designation" placeholder="Designation / Role" value={form.designation} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select name="department" value={form.department} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled>Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            <input type="number" name="salary" placeholder="Total Offered Salary" value={form.salary} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} required className="border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="md:col-span-3 mt-2 flex justify-end">
               <button type="submit" disabled={isAdding} className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md hover:shadow-lg">
                 {isAdding ? "Onboarding..." : "Onboard Employee"}
               </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Role & Dept</th>
                <th className="p-4 font-semibold">Join Date</th>
                <th className="p-4 font-semibold">Offered Salary</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading employees...</td></tr>
              ) : isError ? (
                <tr><td colSpan="6" className="p-4 text-center text-red-500">Failed to load employees</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{emp.name || `${emp.firstName} ${emp.lastName}`}</div>
                      <div className="text-xs text-gray-400 font-mono">{emp.employeeId || `EMP-${emp._id.substring(18).toUpperCase()}`}</div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                       <div>{emp.email}</div>
                       <div className="text-gray-400">{emp.mobileNumber || emp.phone || "N/A"}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-gray-800">{emp.designation || 'Employee'}</div>
                      <div className="text-xs text-blue-600 font-semibold">{emp.department?.name || 'Unassigned'}</div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-4 font-extrabold text-green-700">₹{emp.salary}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleResetPassword(emp._id, emp.name || emp.firstName)}
                          className="bg-gray-100 text-gray-700 font-medium py-1 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
                        >
                          Reset Pass
                        </button>
                        <button 
                          onClick={() => handleDelete(emp._id, emp.name || emp.firstName)}
                          title="Delete Employee"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;