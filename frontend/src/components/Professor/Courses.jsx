import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';



function Courses() {
  const navigate = useNavigate();
  const [courses,setCourses]=useState(null);
  const [loading, setLoading] = useState(true); // Track authentication check
    
    const { user } = useSelector((store) => store.app);

    useEffect(() => {
        const fetchProfessorData = async () => {
          try {
            if (user && user._id) {
              const response = await axios.get(
                `${USER_API_END_POINT}/professor/courses/getcourses/${user._id}`,
                { withCredentials: true }
              );
              setCourses(response.data.courses);
            } else {
              navigate("/"); // Redirect to login if user is not authenticated
            }
          } catch (error) {
            console.error("Error fetching professor data:", error);
            navigate("/"); // Redirect to login on error
          } finally {
            setLoading(false); // Stop loading after authentication check
          }
        };
    
        fetchProfessorData();
      }, [user, navigate]);



    if (loading) {
        return null
    }

  function handleClick(course) {
    // Use an absolute path for navigation
    navigate(`/professor/courses/${course}`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 mt-8 ml-4 max-w-5xl">
        <h2 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2 mb-8">
        Courses
      </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(course)} // Wrap function to pass parameter
              className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
            >
              <h3 className="text-lg font-bold text-gray-800 text-center">{course}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;
