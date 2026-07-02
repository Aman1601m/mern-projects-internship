import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "230px",
        minHeight: "100vh",
      }}
    >
      <h3>HRMS</h3>

      <hr />

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link
            to="/dashboard"
            className="nav-link text-white"
          >
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/employees"
            className="nav-link text-white"
          >
            Employees
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/departments"
            className="nav-link text-white"
          >
            Departments
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/payroll"
            className="nav-link text-white"
          >
            Payroll
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/leave"
            className="nav-link text-white"
          >
            Leave
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;