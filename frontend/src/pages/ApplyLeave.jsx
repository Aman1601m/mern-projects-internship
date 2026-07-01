import { useState } from "react";
import { applyLeave } from "../api/leaveApi";

function ApplyLeave() {

  const [leaveType,
    setLeaveType] =
    useState("");

  const [startDate,
    setStartDate] =
    useState("");

  const [endDate,
    setEndDate] =
    useState("");

  const [reason,
    setReason] =
    useState("");

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        await applyLeave({
          leaveType,
          startDate,
          endDate,
          reason,
        });

        alert(
          "Leave Applied Successfully"
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Error applying leave"
        );

      }
    };

  return (
    <div>

      <h2>Apply Leave</h2>

      <form
        onSubmit={submitHandler}
      >

        <input
          type="text"
          placeholder="Leave Type"
          value={leaveType}
          onChange={(e) =>
            setLeaveType(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            setStartDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            setEndDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
        />

        <br /><br />

        <button
          type="submit"
        >
          Apply Leave
        </button>

      </form>

    </div>
  );
}

export default ApplyLeave;