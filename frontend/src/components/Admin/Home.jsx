import React from 'react';
import FullHeightSidebar from './SideBar';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex">
      <FullHeightSidebar />
      <div className="flex flex-col  items-center w-full bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="text-center mb-8 mt-20">
          <h1 className="text-5xl font-extrabold text-blue-800">Welcome to Dashboard</h1>
          <p className="text-lg text-gray-700 mt-2">Choose an option to proceed</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <Link to={"/administration/professor"}
            className=" flex justify-center items-center w-48 h-16 bg-[#29648A] text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            Professor
          </Link>
          <Link to={"/administration/students"}
            className=" flex justify-center items-center w-48 h-16 bg-[#29648A] text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            Students
          </Link>
          <Link to={"/administration/courses"}
            className="flex justify-center items-center w-48 h-16 bg-[#29648A] text-white text-xl font-bold rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          >
            Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
