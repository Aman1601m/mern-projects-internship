import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import LeaveHistory from "./pages/LeaveHistory";
import LeaveApproval from "./pages/LeaveApproval";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>HRMS Leave Dashboard</h1>

        <nav>
          <Link to="/leave/apply">
            Apply Leave
          </Link>

          {" | "}

          <Link to="/leave/my">
            My Leaves
          </Link>

          {" | "}

          <Link to="/leave/history">
            Leave History
          </Link>

          {" | "}

          <Link to="/leave/manage">
            Leave Approval
          </Link>
        </nav>

        <hr />

        <Routes>
          <Route
            path="/leave/apply"
            element={<ApplyLeave />}
          />

          <Route
            path="/leave/my"
            element={<MyLeaves />}
          />

          <Route
            path="/leave/history"
            element={<LeaveHistory />}
          />

          <Route
            path="/leave/manage"
            element={<LeaveApproval />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;