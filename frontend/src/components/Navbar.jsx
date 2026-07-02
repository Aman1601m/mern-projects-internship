import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-end bg-light p-3">

      <button
        className="btn btn-danger"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;