import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';

function UpdateAttendance() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [students, setStudents] = useState([]); // Full list of students
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered list of students
  const [selectedStudent, setSelectedStudent] = useState(null); // Currently selected student
  const [attendance, setAttendance] = useState(''); // Attendance input state
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/attendance`,
            { withCredentials: true }
          );
          setStudents(response.data.students); // Set full student list
          setFilteredStudents(response.data.students); // Initialize filtered list
        } else {
          navigate('/'); // Redirect to login if user is not authenticated
        }
      } catch (error) {
        console.error('Error fetching professor data:', error);
        navigate('/'); // Redirect to login on error
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

  // Handle click on a student card
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setAttendance(student.attendance || '');
  };

  // Handle attendance update
  const handleUpdateAttendance = async () => {
    if (attendance < 0 || attendance > 100) {
      alert('Attendance must be between 0 and 100!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/attendance/${selectedStudent.rollNo}`,
        { attendance },
        { withCredentials: true }
      );
      console.log('Attendance updated:', response.data);

      // Update the local state with the updated attendance
      const updatedStudents = students.map((std) =>
        std.rollNo === selectedStudent.rollNo
          ? { ...std, attendance }
          : std
      );
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);

      setSelectedStudent(null); // Close the modal
    } catch (error) {
      console.error('Error updating attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <div className="flex items-center flex-col gap-6 md:gap-0 md:flex-row md:justify-between mb-10">
          <h2 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2  mt-14 md:mt-6">Update Attendance</h2>

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
                className="w-full sm:w-1/2 lg:w-1/3 p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
                onClick={() => handleStudentClick(std)}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-gray-700">{std?.fullName}</p>
                  <p className="text-sm text-gray-500">{std?.rollNo}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No students found</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Update Attendance</h3>
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {selectedStudent.fullName}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Roll No:</span> {selectedStudent.rollNo}
            </p>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Attendance (%)</label>
              <input
                  type="number"
                  value={attendance}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 && value <= 100) {
                      setAttendance(value);
                    } else {
                      alert('Please enter a value between 0 and 100!');
                    }
                  }}
                  className="w-full p-2 border rounded-lg"
                />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAttendance}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateAttendance;
