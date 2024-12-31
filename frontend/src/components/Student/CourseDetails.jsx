import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';

function CourseDetails() {
    const { courseCode } = useParams();

    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.app);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                if (user && user._id) {
                    const response = await axios.get(
                        `${USER_API_END_POINT}/student/courses/${courseCode}`,
                        { withCredentials: true }
                    );
                    setCourseDetails(response.data.courseDetails);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [user, navigate]);

    function handleClick(nav) {
        navigate(`/student/courses/${courseCode}/${nav}`);
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
              <p className="text-lg font-bold text-gray-800">Professor(s):</p>
              <ul className="mt-2 space-y-1">
                {courseDetails.professor && courseDetails.professor.length > 0 ? (
                  courseDetails.professor.map((prof, index) => (
                    <li key={index} className="text-gray-600 font-medium">{prof}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No Professors Assigned</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Uploaded PDF Card */}
  <div
    onClick={() => handleClick('uploadedpdf')}
    className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
  >
    <span className="text-4xl">
      <i className="fas fa-upload"></i>
    </span>
    <h3 className="text-xl font-semibold tracking-wide">Uploaded PDF</h3>
    <p className="text-sm font-medium text-gray-200 mt-2">View and manage uploaded course materials, marksheet etc..</p>
  </div>

  {/* Pattern Card */}
  <div
    onClick={() => handleClick('pattern')}
    className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
  >
    <span className="text-4xl">
      <i className="fas fa-users"></i>
    </span>
    <h3 className="text-xl font-semibold tracking-wide">Pattern</h3>
    <p className="text-sm font-medium text-gray-200 mt-2">Check course patterns (Quizes..)</p>
  </div>

  {/* Professor Details Card */}
  <div
    onClick={() => handleClick('professordetails')}
    className="p-6 bg-[#2E9CCA] rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-[#1a7f8c] cursor-pointer flex flex-col items-center text-white gap-4 ease-in-out duration-300"
  >
    <span className="text-4xl">
      <i className="fas fa-clipboard-check"></i>
    </span>
    <h3 className="text-xl font-semibold tracking-wide">Professor Details</h3>
    <p className="text-sm font-medium text-gray-200 mt-2">View professor information </p>
  </div>
</div>

      </div>
    </div>
    );
}

export default CourseDetails;
