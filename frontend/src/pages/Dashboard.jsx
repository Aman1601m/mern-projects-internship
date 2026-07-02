import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container-fluid p-4">

        <h2>Dashboard</h2>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Total Employees</h5>
              <h2>0</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Departments</h5>
              <h2>0</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5>Payroll</h5>
              <h2>0</h2>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;