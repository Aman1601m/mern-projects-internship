import Sidebar from "../components/Sidebar";

function Leave() {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-center px-8 shadow-sm">
           <h2 className="text-2xl font-bold text-gray-800 m-0">Leave Management</h2>
        </div>
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 flex flex-col items-center justify-center text-center h-[60vh]">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Module Not Implemented</h3>
            <p className="text-gray-500 max-w-md">
              The Leave Management module is currently empty. This section is reserved for Member B to implement the complex leave accrual and approval workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leave;
