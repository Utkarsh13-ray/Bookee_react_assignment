import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CitySelector from './CitySelector';
import RedSpinner from '../assets/spinner_red.svg';
import GreenSpinner from '../assets/spinner_green.svg';

const AvailableShifts = () => {
  // State variables for managing shifts
  const [availableShifts, setAvailableShifts] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(true);

  // State variables for managing selected city and shift booking/cancel loading
  const [selectedCity, setSelectedCity] = useState('Helsinki');
  const [cityShiftCounts, setCityShiftCounts] = useState({});
  const [loading, setLoading] = useState(null);

  // Fetch all shifts when the selected city changes or on component mount
  useEffect(() => {
    const fetchAllShifts = async () => {
      try {
        // Fetch all shifts from the server
        const response = await axios.get('http://localhost:5000/shifts');
        
        // Set available shifts for the selected city
        setAvailableShifts(response.data.filter((s) => s.area === selectedCity));
        
        // Set all shifts for overlapping checks
        setAllShifts(response.data);
        
        // Update city shift counts
        const counts = response.data.reduce((acc, shift) => {
          acc[shift.area] = (acc[shift.area] || 0) + 1;
          return acc;
        }, {});
        setCityShiftCounts(counts);

        // Loading shifts is complete
        setLoadingShifts(false);
      } catch (error) {
        console.error('Error fetching all shifts:', error);
      }
    };

    fetchAllShifts();
  }, [selectedCity]);

  // Function to check if a shift is overlapping with any other shift
  const isOverlapping = (shift) => {
    const startA = new Date(shift.startTime);
    const endA = new Date(shift.endTime);
  
    for (const otherShift of allShifts) {
      if (otherShift.id !== shift.id) { // Exclude the same shift
        const startB = new Date(otherShift.startTime);
        const endB = new Date(otherShift.endTime);
  
        if (otherShift.booked && startA < endB && endA > startB) {
          return true; // Overlapping 
        }
      }
    }
  
    return false; // No overlapping
  };

  // Function to handle booking a shift
  const handleBookShift = async (shiftId) => {

    try {
      // Set loading state for the booked shift
      setLoading(shiftId);

      // Send a request to book the shift
       await axios.post(`http://localhost:5000/shifts/${shiftId}/book`);
    
      // console.log('Shift successfully booked.');

      // Update the state to mark the shift as booked
      setAvailableShifts((prevShifts) => {
        const updatedShifts = prevShifts.map((shift) =>
          shift.id === shiftId ? { ...shift, booked: true, status: 'Booked' } : shift
        );
        return updatedShifts;
      });
    } catch (error) {
      console.error('Error booking shift:', error);
    } finally {
      // Reset loading state when booking is complete
      setLoading(null);
    }
  };

  // Function to handle canceling a shift
  const handleCancelShift = async (shiftId) => {
    console.log("Attempting to cancel shift with ID:", shiftId);

    try {
      // Set loading state for the canceled shift
      setLoading(shiftId);

      // Send a request to cancel the shift
      await axios.post(`http://localhost:5000/shifts/${shiftId}/cancel`);
      // console.log("Shift successfully canceled.");

      // Update the state to mark the shift as not booked
      const updatedShifts = availableShifts.map((shift) =>
        shift.id === shiftId ? { ...shift, booked: false } : shift
      );
      setAvailableShifts(updatedShifts);
    } catch (error) {
      console.error("Error cancelling shift:", error);
    } finally {
      // Reset loading state when canceling is complete
      setLoading(null);
    }
  };

  // Function to display the date of a shift
  const getShiftDateDisplay = (shiftDate) => {
    const now = new Date();
    const shift = new Date(shiftDate);

    if (now.toDateString() === shift.toDateString()) {
      return 'Today';
    } else if (now.getDate() + 1 === shift.getDate()) {
      return 'Tomorrow';
    } else {
      return shift.toLocaleDateString('en-IN');
    }
  };

  // Organize shifts by date
  const shiftsByDate = availableShifts.reduce((acc, shift) => {
    const dateKey = getShiftDateDisplay(shift.startTime);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(shift);
    return acc;
  }, {});

  // Function to check if a shift has already started
  const isShiftStarted = (shift) => {
    const now = new Date();
    return now >= new Date(shift.startTime);
  };

  // Render the component
  return (
    <div className="">
      {/* City selector component */}
      <CitySelector onSelectCity={setSelectedCity} cityShiftCounts={cityShiftCounts} selectedCity={selectedCity}/>

      {/* Display shifts organized by date */}
      {Object.entries(shiftsByDate).map(([date, shifts]) => (
        <div key={date} className="">
          {/* Display date header */}
          <h3 className="text-xl font-semibold text-white p-4 bg-teal-500">{date}</h3>

          {/* Display each shift for the date */}
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center justify-between bg-white p-4 border-b-2 border-[#A4B8D3] border-solid relative">
              <p className="text-xl">
                {/* Display shift time range */}
                {new Date(shift.startTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })} -{' '}
                {new Date(shift.endTime).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric' })}
              </p>
              
              {/* Render buttons based on shift state and conditions */}
              {isShiftStarted(shift) ? (
                <div className='flex'>
                  {shift.booked && (
                    <div className="text-purple-500  px-2  text-xl py-2 ">
                      Booked
                    </div>
                  )}
                  <button
                    className={`text-xl  bg-white text-green-300 px-4 py-1 rounded-full border-2 border-green-300 border-solid ${loading ? 'disabled' : ''}`}
                    disabled={loading}
                  >
                    Book Shift
                  </button>
                </div>
              ) : (
                <>
                  {shift.booked ? (
                    <div className='flex'>
                      <div className="text-purple-500  px-2  text-xl py-2">
                        Booked
                      </div>
                      <div className="relative">
                        <button
                          className={`text-xl bg-white text-red-500 px-4 py-1 rounded-full w-30 border-2 border-red-500 border-solid ${
                            loading === shift.id ? 'opacity-0' : 'opacity-100'
                          }`}
                          onClick={() => handleCancelShift(shift.id)}
                        >
                          Cancel
                        </button>
                        {loading === shift.id && (
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
                    </div>
                  ) : isOverlapping(shift) ? (
                    <div className='flex'>
                      <div className="text-amber-500  px-2  text-xl py-2">
                        Overlapping
                      </div>
                      <button
                        className="text-xl  bg-white text-green-300 px-4 py-1 rounded-full border-2 border-green-300 border-solid disabled"
                        disabled
                      >
                        Book
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        className={`text-xl bg-white text-green-500 px-4 py-1 rounded-full w-30 border-2 border-green-500 border-solid ${loading === shift.id ? 'opacity-0' : 'opacity-100'}`}
                        onClick={() => handleBookShift(shift.id)}
                      >
                        Book
                      </button>
                      {loading === shift.id && (
                        <div
                          className="border-green-500 border-2 rounded-full py-2"
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
                          <img src={GreenSpinner} alt="greenspinner" style={{ width: '100%', height: '100%' }} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Display loading message while shifts are being fetched */}
      {loadingShifts && <p className="text-2xl text-teal-400 p-4">Loading Available shifts...</p>}
    </div>
  );
};

export default AvailableShifts;
