import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

function CourseDetails() {
  const { courseCode } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}`,
            { withCredentials: true }
          );
          setCourseDetails(response.data.courseDetails);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [user, navigate, courseCode]);

  function handleClick(nav) {
    navigate(`/professor/courses/${courseCode}/${nav}`);
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar Component */}
    <Sidebar />
  
    {/* Main Content */}
    <div className="p-6 mt-20 md:mt-14 ml-4 w-full flex flex-col gap-8">
      {/* Course Details Card */}
      <div className="w-full max-w-3xl mx-auto bg-white p-8 gap-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
        <p className="text-4xl font-extrabold font-inter text-blue-900 tracking-tight">
          {courseCode || 'Course Code'}
        </p>
        <div className="mt-10 flex justify-between">
          <p className="text-lg font-semibold text-gray-700">
            {courseDetails?.courseName || 'Course Name'}
          </p>
          <div>
            <p className="text-lg font-bold text-gray-800">
              Students:{' '}
              <span className="text-gray-600 font-medium">
                {courseDetails?.totalStudents || 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>
  
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload PDF Card */}
        <div
          onClick={() => handleClick('uploadpdf')}
          className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
        >
          <span className="text-4xl">
            <i className="fas fa-upload"></i>
          </span>
          <h3 className="text-xl font-semibold tracking-wide">Upload PDF</h3>
          <p className="text-sm font-medium text-gray-200 mt-2">
            Upload course materials or relevant documents.
          </p>
        </div>
  
        {/* Students Card */}
        <div
          onClick={() => handleClick('students')}
          className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
        >
          <span className="text-4xl">
            <i className="fas fa-users"></i>
          </span>
          <h3 className="text-xl font-semibold tracking-wide">Students</h3>
          <p className="text-sm font-medium text-gray-200 mt-2">
            View and manage student lists and details.
          </p>
        </div>
  
        {/* Update Attendance Card */}
        <div
          onClick={() => handleClick('updateattendance')}
          className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
        >
          <span className="text-4xl">
            <i className="fas fa-clipboard-check"></i>
          </span>
          <h3 className="text-xl font-semibold tracking-wide">
            Update Attendance
          </h3>
          <p className="text-sm font-medium text-gray-200 mt-2">
            Record or update attendance data.
          </p>
        </div>
  
        {/* Update Pattern Card */}
        <div
          onClick={() => handleClick('updatepattern')}
          className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
        >
          <span className="text-4xl">
            <i className="fas fa-edit"></i>
          </span>
          <h3 className="text-xl font-semibold tracking-wide">Update Pattern</h3>
          <p className="text-sm font-medium text-gray-200 mt-2">
            Modify or update the course pattern or schedule.
          </p>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default CourseDetails;
