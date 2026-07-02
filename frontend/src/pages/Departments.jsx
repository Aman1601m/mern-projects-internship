import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");

      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex">

      <Sidebar />

      <div className="container-fluid p-4">

        <h2>Departments</h2>

        <table className="table table-striped mt-3">

          <thead className="table-dark">
            <tr>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.name}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Departments;