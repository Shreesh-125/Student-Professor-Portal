  import React, { useEffect, useState } from 'react';
  import Sidebar from './SideBar';
  import { useSelector } from 'react-redux';
  import { useNavigate, useParams } from 'react-router-dom';
  import axios from 'axios';
  import { USER_API_END_POINT } from '@/utils/constant';

  function Attendance() {
    const { user } = useSelector((store) => store.app);
    const { courseCode } = useParams();
    const navigate = useNavigate();

    const [courseAttendance, setCourseAttendance] = useState([]);

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
      const fetchCourseAttendance = async () => {
        try {
          if (user && user._id) {
            const response = await axios.get(
              `${USER_API_END_POINT}/student/attendance/${user._id}`,
              { withCredentials: true }
            );
            setCourseAttendance(response.data.courseAttendance);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching attendance details:', error);
          navigate('/');
        }
      };

      fetchCourseAttendance();
    }, [user, courseCode, navigate]);

    return (
      <div className="min-h-screen flex bg-gray-50">
  <Sidebar className="shadow-md" />
  <div className="flex flex-col w-full p-8 bg-gray-100">
    {/* Page Header */}
    <div className="mb-8 mt-10 md:mt-0">
      <h2 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2">
        Attendance Overview
      </h2>
    </div>

    {/* Content */}
    <div className="mt-8">
      {courseAttendance.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courseAttendance.map((item, index) => (
            <div
              key={index}
              className="p-6 border rounded-xl shadow-md bg-white flex flex-col gap-4 hover:scale-105 transition-transform duration-300 hover:shadow-lg"
            >
              <p className="text-xl font-bold text-gray-800 truncate" title={item.course}>
                {item.course}
              </p>
              <p className="text-lg font-medium text-gray-600 truncate" title={item.courseName}>
                {item.courseName}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-blue-600">Attendance:</span> {item.attendance}%
              </p>
              {item?.lastUpdated && (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">Last Updated:</span> {formatDate(item.lastUpdated)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <p className="text-lg font-medium">No attendance records available yet.</p>
          <p className="text-sm">Please check back later.</p>
        </div>
      )}
    </div>
  </div>
</div>

    );
  }

  export default Attendance;
