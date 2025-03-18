import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { PiStudentBold } from "react-icons/pi";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin border-t-4 border-gray-500 border-solid w-12 h-12 rounded-full"></div>
  </div>
);

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
  const [isLoadingStudents, setIsLoadingStudents] = useState(true); // New loading state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New loading state for uploading

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
      }finally {
        setIsLoadingStudents(false); // Stop loading spinner
      }
    };

    fetchStudents();
  }, [user, courseCode, navigate,isUploading]);

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

  // Handle xsl upload
  const handleUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // Ensure the key matches the server-side field
  
      try {
        setIsUploading(true); // Indicate the upload process has started
  
        // Make POST request to upload the file
        const response = await axios.post(
          `${USER_API_END_POINT}/professor/courses/${courseCode}/attendance/uploadattendancesheet`,
          formData,
          {
            withCredentials: true, // Send cookies if required
            headers: {
              "Content-Type": "multipart/form-data", // Specify multipart content type
            },
          }
        );
  
        if (response.data.success) {
          // Handle success
          const newFile = {
            url: response.data.fileUrl, // Use fileUrl from response
            name: file.name, // Retain the original file name
          };
  
          toast.success(response.data.message)
          setIsUploadModalOpen(false); // Close the upload modal
        } else {
          console.error("Failed to upload file:", response.data.message);
        }
       
      } catch (error) {
        console.error("Error uploading file:", error); // Log any errors
        toast.error(error.response.data.message);
      } finally {
        setIsUploading(false); // Reset the uploading state
      }
    }
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 lg:mr-10">
          <h2 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mt-14 md:mt-6">Update Attendance</h2>

          {/* Search Bar */}
          <div className="relative w-56 md:w-60 lg:w-96">
            <input
              type="text"
              placeholder="Search Roll No..."
              className="w-full h-12 p-2 text-md font-kanit border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#333945]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
         

        </div>

        <button
          className="w-56 mb-10 flex font-kanit font-semibold items-center justify-center bg-[#121A27] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#27364b]"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Excel Sheet
        </button>

        {/* Student List or Loader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoadingStudents ? (
                    <LoadingSpinner /> // Show loading spinner
                  ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((std, index) => (
                      <div
                        key={std._id || index}
                        className="p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
                        onClick={() => handleStudentClick(std)}
                      >
                        <div className="flex gap-2 items-center">
                          <PiStudentBold size={27} className="text-[#121A27]" />
                          <div>
                            <p className="text-lg font-semibold text-gray-700 font-kanit">{std?.fullName}</p>
                            <p className="text-sm text-gray-500 font-kanit">{std?.rollNo}</p>
                          </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 font-kanit">
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
                className="px-4 py-2 bg-[#121A27] hover:bg-[#27364B] text-white rounded-lg"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}


       {/* Upload Attendance Modal */}
  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-[#121A27] font-kanit border-b-2 border-gray-500 pb-2">Upload Attendance File</DialogTitle>
      </DialogHeader>
      <p className="text-gray-600 text-sm mb-2 font-kanit ">
        Please upload an Excel file with Roll Numbers and Attendance. Ensure the columns are labeled <span className="font-bold">'Roll No.'</span> and <span className="font-bold font-kanit">'Attendance'</span>.
      </p>
      <input
        type="file"
        accept=".xls, .xlsx"
        onChange={handleUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:[#333945] file:text-[#121A27] hover:file:bg-gray-300"
      />
      {isUploading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner />
        </div>
      )}
      
    </DialogContent>
  </Dialog>
    </div>
  );
}

export default UpdateAttendance;
