import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

const getToken = () =>
  localStorage.getItem("token");

export const getMyLeaves =
  async () => {
    const response =
      await axios.get(
        `${API}/leave/my`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };

export const applyLeave =
  async (leaveData) => {
    const response =
      await axios.post(
        `${API}/leave/apply`,
        leaveData,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };