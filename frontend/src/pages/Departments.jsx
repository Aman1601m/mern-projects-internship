import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { useGetEmployeesQuery } from "../store/apiSlice";
import { Building2, Users, ArrowLeft } from "lucide-react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch all employees to filter them later by department
  const { data: employeesResponse } = useGetEmployeesQuery();
  const allEmployees = employeesResponse?.data || [];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.data);
    } catch (err) {
      // departments failed to load
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post("/departments", { name }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setName("");
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding department");
    }
  };

  const getEmployeesForDepartment = (deptId) => {
    return allEmployees.filter(emp => emp.department && emp.department._id === deptId);
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-center px-8 shadow-sm">
           <h2 className="text-2xl font-bold text-gray-800 m-0">Departments</h2>
        </div>
        <div className="p-8">
          
          {selectedDepartment ? (
            // Detail View
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setSelectedDepartment(null)}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium mb-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Departments
              </button>

              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 border-t-4 border-t-blue-500 mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 m-0">{selectedDepartment.name}</h2>
                    <p className="text-gray-500 font-medium">Department Details & Team Members</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-400" />
                    Employees in {selectedDepartment.name}
                  </h3>
                  <span className="bg-white text-gray-600 text-xs font-bold px-3 py-1 rounded-full border shadow-sm">
                    {getEmployeesForDepartment(selectedDepartment._id).length} Members
                  </span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getEmployeesForDepartment(selectedDepartment._id).length === 0 ? (
                      <tr><td colSpan="3" className="p-8 text-center text-gray-500">No employees found in this department.</td></tr>
                    ) : (
                      getEmployeesForDepartment(selectedDepartment._id).map((emp) => (
                        <tr key={emp._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-gray-800">{emp.name}</td>
                          <td className="p-4 text-gray-600">{emp.email}</td>
                          <td className="p-4 text-gray-500">{emp.designation || "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Grid View
            <div className="animate-in fade-in duration-500">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 border-t-4 border-t-purple-500">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Department</h3>
                <form onSubmit={handleAddDepartment} className="flex gap-4">
                  <input 
                    type="text" 
                    className="flex-1 border p-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Department Name (e.g. Engineering, Sales)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                  />
                  <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg">
                    Add Department
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.length === 0 ? (
                  <div className="col-span-full text-center p-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                    No departments found. Create one above!
                  </div>
                ) : (
                  departments.map((dept) => {
                    const empCount = getEmployeesForDepartment(dept._id).length;
                    return (
                      <div 
                        key={dept._id} 
                        onClick={() => setSelectedDepartment(dept)}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 cursor-pointer group hover:border-blue-300 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Building2 className="w-20 h-20 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 m-0 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
                        </div>
                        
                        <div className="flex items-center text-gray-500 text-sm mt-4 pt-4 border-t border-gray-50 relative z-10">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="font-semibold text-gray-700 mr-1">{empCount}</span> 
                          {empCount === 1 ? 'Employee' : 'Employees'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Departments;