// CitySelector.js
import React from 'react';

const CitySelector = ({ onSelectCity, cityShiftCounts,selectedCity }) => {
  const cities = ['Helsinki', 'Tampere', 'Turku'];
  console.log(selectedCity)
  return (
    <div className=" w-full">
      <div className="flex">
        {cities.map((city) => (
          <button
            key={city}
            className={`${selectedCity===city?'bg-white':''} w-1/3 text-2xl text-teal-500 px-2 py-5 border-r-2 border-l-2`}
            onClick={() => onSelectCity(city)}
          >
            {`${city} (${cityShiftCounts[city] || 0})`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;
