import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useGetPayrollsQuery, useCreatePayrollMutation, useGetEmployeesQuery } from "../store/apiSlice";
import { FileText, Plus, X, Download } from "lucide-react";

function Payroll() {
  const { data: payrollRes, isLoading } = useGetPayrollsQuery();
  const { data: employeesRes } = useGetEmployeesQuery();
  const [createPayroll, { isLoading: isCreating }] = useCreatePayrollMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    month: "January",
    year: new Date().getFullYear().toString(),
    basicSalary: "",
    hra: "",
    allowances: "",
    deductions: "",
    paymentStatus: "Pending",
  });

  const payrolls = payrollRes?.data || [];
  const employees = employeesRes?.data || [];

  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/payroll/${id}/download`, "_blank");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayroll(formData).unwrap();
      setIsModalOpen(false);
      setFormData({
        employee: "", month: "January", year: new Date().getFullYear().toString(),
        basicSalary: "", hra: "", allowances: "", deductions: "", paymentStatus: "Pending"
      });
    } catch (error) {
      alert(error?.data?.message || "Error generating payroll");
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Payroll & Payslips</h2>
            <p className="text-sm text-gray-500 mt-1">Manage employee salaries and generate payslip PDFs</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={18} /> Generate Payroll
          </button>
        </div>
        
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold">Employee</th>
                    <th className="px-6 py-4 font-semibold">Period</th>
                    <th className="px-6 py-4 font-semibold">Basic Salary</th>
                    <th className="px-6 py-4 font-semibold">Net Salary</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading payrolls...</td></tr>
                  ) : payrolls.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FileText size={48} className="mb-4 opacity-20" />
                          <p className="text-lg text-gray-600 font-medium">No payroll records found</p>
                          <p className="text-sm mt-1">Click 'Generate Payroll' to create a new payslip.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payrolls.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{record.employee?.firstName} {record.employee?.lastName}</div>
                          <div className="text-xs text-gray-500">{record.employee?.designation}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {record.month} {record.year}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">₹{record.basicSalary}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{record.netSalary}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            record.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {record.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDownload(record._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Download size={16} /> PDF
                          </button>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Generate Payroll Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Employee</label>
                  <select
                    required
                    value={formData.employee}
                    onChange={(e) => setFormData({...formData, employee: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Basic Salary (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">HRA (₹)</label>
                  <input
                    type="number"
                    value={formData.hra}
                    onChange={(e) => setFormData({...formData, hra: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Allowances (₹)</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deductions (₹)</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? "Generating..." : "Generate Payslip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
