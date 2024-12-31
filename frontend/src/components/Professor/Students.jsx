import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';

function Students() {
  const [students, setStudents] = useState([]); // Full list of students
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered list of students
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [expandedStudent, setExpandedStudent] = useState(null); // Track the clicked student
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/students`,
            { withCredentials: true }
          );
          setStudents(response.data.students); // Set full student list
          setFilteredStudents(response.data.students); // Initialize filtered list
        } else {
          navigate("/"); // Redirect to login if user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
        navigate("/"); // Redirect to login on error
      }
    };

    fetchStudents();
  }, [user, courseCode, navigate]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter students based on roll number
    const filtered = students.filter((std) =>
      std.rollNo.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  // Toggle expanded student view
  const handleStudentClick = (studentId) => {
    setExpandedStudent((prev) => (prev === studentId ? null : studentId)); // Toggle the selected student
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
    {/* Sidebar Component */}
    <Sidebar />
    
    <div className="flex flex-col w-full p-6">
      {/* Header and Search Bar Section */}
      <div className="flex items-center flex-col gap-6 md:gap-0 md:flex-row md:justify-between mb-10 mt-10 md:mt-6 ">
        <h2 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2">Courses Students</h2>
  
        {/* Search Bar */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search Roll No..."
            className="w-full p-2 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
  
      {/* Student Cards */}
      <div className="flex flex-wrap gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((std) => (
            <div
              key={std._id}
              className="w-full sm:w-1/2 lg:w-1/3 p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              onClick={() => handleStudentClick(std._id)}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-gray-700">{std?.fullName}</p>
                <p className="text-sm text-gray-500">{std?.rollNo}</p>
              </div>
  
              {/* Toggle more info on student click */}
              {expandedStudent === std._id && (
                <div className="mt-3 border-t pt-3 text-sm text-gray-600">
                  <p>Email: {std?.instituteMailId}</p>
                  <p>Attendance: {std?.attendance}%</p>
                  <p>Phone: {std?.number}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No students found</p> // Fallback message when no students match the search query
        )}
      </div>
    </div>
  </div>
  
  );
}

export default Students;
