// App.js
import './index.css'
import React, { useState } from 'react';
import MyShifts from './components/MyShifts';
import AvailableShifts from './components/AvailableShifts';

const App = () => {
  const [activeTab, setActiveTab] = useState('myShifts'); // 'myShifts' or 'availableShifts'

  return (
    <div className="w-full bg-[#E0FFFF] py-8 min-h-[100vh] ">
      

      <div className='w-[60%] mx-auto my-10 min-h-[60%]  '>
      <div className="flex gap-2 mb-4">
        <div
          className={`text-xl cursor-pointer font-semibold px-4 py-2 rounded ${
            activeTab === 'myShifts' ? ' text-cyan-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('myShifts')}
        >
          My Shifts
        </div>
        <div
          className={`text-xl cursor-pointer font-semibold px-4 py-2 rounded ${
            activeTab === 'availableShifts' ? ' text-cyan-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('availableShifts')}
        >
          Available Shifts
        </div>
      </div>
       <div className=' border-2 border-[#A4B8D3] border-solid rounded-lg shadow-xl '>
        {activeTab === 'myShifts' && <MyShifts />}
        {activeTab === 'availableShifts' && <AvailableShifts />}
        </div>
      </div>
    </div>
  );
};

export default App;
