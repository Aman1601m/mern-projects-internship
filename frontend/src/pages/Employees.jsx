import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useGetEmployeesQuery, useAddEmployeeMutation } from "../store/apiSlice";
import api from "../services/api";

function Employees() {
  const { data: response, isLoading, isError } = useGetEmployeesQuery();
  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();

  const [form, setForm] = useState({ name: "", email: "", mobileNumber: "", designation: "", department: "", salary: "", joiningDate: "" });
  const [departments, setDepartments] = useState([]);

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
      const res = await addEmployee(form).unwrap();
      setForm({ name: "", email: "", mobileNumber: "", designation: "", department: "", salary: "", joiningDate: "" });
      alert(res.message || "Employee added successfully!");
    } catch (err) {
      alert("Failed to add employee: " + (err.data?.message || err.error));
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
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading employees...</td></tr>
              ) : isError ? (
                <tr><td colSpan="5" className="p-4 text-center text-red-500">Failed to load employees</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400 font-mono">EMP-{emp._id.substring(18).toUpperCase()}</div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                       <div>{emp.email}</div>
                       <div className="text-gray-400">{emp.mobileNumber || "N/A"}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-gray-800">{emp.designation || 'Employee'}</div>
                      <div className="text-xs text-blue-600 font-semibold">{emp.department?.name || 'Unassigned'}</div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "N/A"}</td>
                    <td className="p-4 font-extrabold text-green-700">₹{emp.salary}</td>
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