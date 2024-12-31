import React, { useEffect, useState } from 'react'
import Sidebar from './SideBar'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';

function Pattern() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState([]);

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/pattern`,
            { withCredentials: true }
          );
          setPattern(response.data.pattern);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching pattern data:', error);
        navigate('/');
      }
    };

    fetchPattern();
  }, [user, courseCode, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50">
    <Sidebar />
    <div className="flex flex-col w-full p-6">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2">Course Pattern</h2>
      </div>
  
      {/* Existing Patterns Section */}
      <div className="mt-6">
    
        {pattern.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pattern.map((item, index) => (
              <div
                key={index}
                className="relative p-6 border rounded-lg shadow-md bg-white flex flex-col gap-3 transition-transform transform hover:scale-105 hover:shadow-lg duration-200"
              >
                {/* Name */}
                <p className="text-lg font-bold text-gray-700">{item.name}</p>
                
                {/* Weightage */}
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Weightage:</span> {item.weightage}%
                </p>
                
                {/* Note (if available) */}
                {item?.note && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> {item.note}
                  </p>
                )}
  
                {/* Highlight Effect */}
                <span className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-0 rounded-lg hover:opacity-50 transition-opacity duration-300"></span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No patterns added yet.</p>
        )}
      </div>
    </div>
  </div>
  
  )
}

export default Pattern