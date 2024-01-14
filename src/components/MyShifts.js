// MyShifts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import RedSpinner from '../assets/spinner_red.svg';

const MyShifts = () => {
  // State to manage fetched shifts and loading status
  const [myShifts, setMyShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // Fetch user's shifts when the component mounts
  useEffect(() => {
    const fetchMyShifts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/shifts");
        setMyShifts(response.data);
        setLoadingShifts(false); // Loading complete
      } catch (error) {
        console.error("Error fetching my shifts:", error);
      }
    };

    fetchMyShifts();
  }, []);

  // Function to handle canceling a shift
  const handleCancelShift = async (shiftId) => {
    try {
      setLoadingCancel(shiftId); // Set loading state while canceling
      await axios.post(`http://localhost:5000/shifts/${shiftId}/cancel`);

      // Update shifts after successful cancellation
      const updatedShifts = myShifts.map((shift) =>
        shift.id === shiftId ? { ...shift, booked: false } : shift
      );
      setMyShifts(updatedShifts);
    } catch (error) {
      console.error("Error cancelling shift:", error);
    } finally {
      setLoadingCancel(null); // Reset loading state after completion
    }
  };

  // Function to check if a shift has already started
  const isShiftStarted = (shift) => {
    const now = new Date();
    return now >= new Date(shift.startTime);
  };

  // Function to format shift date display
  const getShiftDateDisplay = (shiftDate) => {
    const now = new Date();
    const shift = new Date(shiftDate);

    if (now.toDateString() === shift.toDateString()) {
      return "Today";
    } else if (now.getDate() + 1 === shift.getDate()) {
      return "Tomorrow";
    } else {
      return shift.toLocaleDateString("en-IN");
    }
  };

  // Function to calculate total time for a list of shifts
  const calculateTotalTime = (shifts) => {
    let totalHours = 0;
    let totalMinutes = 0;

    shifts.forEach((shift) => {
      const start = new Date(shift.startTime);
      const end = new Date(shift.endTime);
      const duration = end - start;

      totalHours += Math.floor(duration / (1000 * 60 * 60));
      totalMinutes += Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    });

    totalHours += Math.floor(totalMinutes / 60); 
    totalMinutes %= 60;

    return { totalHours, totalMinutes };
  };

  // Organize shifts by date
  const shiftsByDate = myShifts.reduce((acc, shift) => {
    const dateKey = getShiftDateDisplay(shift.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = { shifts: [], totalHours: 0, totalMinutes: 0 };
    }
    acc[dateKey].shifts.push(shift);
    return acc;
  }, {});

  // Calculate total time for each date
  Object.values(shiftsByDate).forEach((dateData) => {
    const { totalHours, totalMinutes } = calculateTotalTime(dateData.shifts);
    dateData.totalHours = totalHours;
    dateData.totalMinutes = totalMinutes;
  });

  // Display loading message if shifts are still loading
  if (loadingShifts) {
    return <p className="text-2xl text-teal-400 p-4">Loading shifts...</p>;
  }
  return (
    <div className="">
      {Object.entries(shiftsByDate).map(
        ([date, { shifts, totalHours, totalMinutes }]) => (
          <div key={date}>
            {shifts.filter((s) => s.booked).length > 0 && (
              <div className="flex gap-2 align-middle p-4 bg-teal-500">
                <h3 className="text-xl font-semibold text-white ">{date}</h3>
                <p className="pt-1 text-gray-200">
                  {shifts.length}, {totalHours} hours {totalMinutes} minutes
                </p>
              </div>
            )}
            {shifts
              .filter((s) => s.booked)
              .map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between bg-white p-4 border-b-2 border-[#A4B8D3] border-solid"
                >
                  <div>
                    <p className="text-xl">
                      {new Date(shift.startTime).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(shift.endTime).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                    <p className="text-gray-500">{shift.area}</p>
                  </div>
                  {isShiftStarted(shift) ? (
                    <button
                      className="bg-white text-red-300 px-2 py-1 rounded-full border-2 border-red-300 border-solid disabled:"
                    >
                      Cancel
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        className={`text-xl bg-white text-red-500 px-4 py-1 rounded-full w-30 border-2 border-red-500 border-solid ${
                          loadingCancel === shift.id ? 'opacity-0' : 'opacity-100'
                        }`}
                        onClick={() => handleCancelShift(shift.id)}
                      >
                        Cancel
                      </button>
                      {loadingCancel === shift.id && (
                        <div
                          className="border-red-500 border-2 rounded-full py-2"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                          }}
                        >
                          <img src={RedSpinner} alt="red spinner" style={{ width: '100%', height: '100%' }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )
      )}

      {Object.entries(shiftsByDate).filter(
        ([, { shifts }]) => shifts.filter((s) => s.booked).length > 0
      ).length === 0 && <p>No booked shifts</p>}
    </div>
  );
};

export default MyShifts;
