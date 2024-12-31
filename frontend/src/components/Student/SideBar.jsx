import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChalkboardTeacher, FaSignOutAlt, FaBars } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { logoutUser } from "@/redux/appSlice";  // Import logout action
import { IoMdHome } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location from the URL

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(logoutUser());
      localStorage.removeItem('user');
      navigate('/');
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to check if the current location matches the link
  const isActive = (path) => {
    // Handle 'Home' link separately, match only '/student'
    if (path === '/student') {
      return location.pathname === path ? 'bg-[#1A4F72] text-white' : 'text-gray-400 hover:bg-[#29648A] hover:text-white';
    }
    
    // For all other links, check if the pathname starts with the path
    return location.pathname.startsWith(path) ? 'bg-[#1A4F72] text-white' : 'text-gray-400 hover:bg-[#29648A] hover:text-white';
  };

  if(!user){
    return null;
  }

  return (
    <div className="relative">
      {/* Hamburger Icon for Small Screens */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-2 rounded-md bg-gray-50 shadow-md"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} fixed md:translate-x-0 md:static top-0 left-0 min-h-full w-64 bg-[#29648A] flex flex-col shadow-lg transform transition-transform duration-300 z-40`}
      >
        {/* Sidebar Links */}
        <nav className="flex-1  space-y-4 pt-40 md:pt-0">
          <Link
            to="/student"
            className={`flex items-center gap-4  p-3 rounded-md ${isActive('/student')}`}
            onClick={() => isOpen && toggleSidebar()}
          >
            <IoMdHome size={20} />
            <span className="text-sm font-bold">Home</span>
          </Link>

          <Link
            to="/student/courses"
            className={`flex items-center gap-4 p-3 rounded-md ${isActive('/student/courses')}`}
            onClick={() => isOpen && toggleSidebar()}
          >
            <FaChalkboardTeacher size={20} />
            <span className="text-sm font-bold">Courses</span>
          </Link>

          <Link
            to="/student/attendance"
            className={`flex items-center gap-4 p-3 rounded-md ${isActive('/student/attendance')}`}
            onClick={() => isOpen && toggleSidebar()}
          >
            <FaChalkboardTeacher size={20} />
            <span className="text-sm font-bold">Attendance</span>
          </Link>

          <Link
            to="/student/changepassword"
            className={`flex items-center gap-4 p-3 rounded-md ${isActive('/student/changepassword')}`}
            onClick={() => isOpen && toggleSidebar()}
          >
            <RiLockPasswordFill size={20} />
            <span className="text-sm font-bold">Change Password</span>
          </Link>

          <div onClick={handleLogout}>
            <Link
              to="/"
              className="flex items-center gap-4 p-3 hover:bg-[#29648A] hover:text-white rounded-md"
            >
              <FaSignOutAlt size={20} />
              <span className="text-sm font-bold">Logout</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-400">&copy; 2024 Academic Portal</p>
        </div>
      </div>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default Sidebar;
