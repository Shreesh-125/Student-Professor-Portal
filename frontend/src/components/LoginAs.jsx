import React from "react";
import image from "../../public/LoginAsImg.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";

function LoginAs() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center  gap-16 bg-gray-50 min-h-screen py-10">
      {/* Title */}
      <h1 className="text-5xl  font-inter mt-10 font-bold text-gray-800 drop-shadow-md text-center">
        Academic Portal
      </h1>

      {/* Main container */}
      <div className="flex w-[80vw] md:w-[700px] h-[450px] shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
        {/* Left section */}
        <div className="w-full flex flex-col items-center  p-2 gap-6 bg-gray-100 md:w-1/2">
          <p className="text-4xl font-inter font-bold text-gray-700 mb-4 mt-12">
            Login As
          </p>
          <Link to="/administration/login">
            <Button className="bg-[#29648A] text-white text-lg py-3 px-6 rounded-lg font-bold shadow-md hover:bg-[#1f4f6e] transition duration-300 w-[200px] h-[40px]">
              Administrator
            </Button>
          </Link>
          <Link to="/professor/login">
            <Button className="bg-[#29648A] text-white text-lg py-3 px-6 rounded-lg font-bold shadow-md hover:bg-[#1f4f6e] transition duration-300 w-[200px] h-[40px]">
              Professor
            </Button>
          </Link>
          <Link to="/student/login">
            <Button className="bg-[#29648A] text-white text-lg py-3 px-6 rounded-lg font-bold shadow-md hover:bg-[#1f4f6e] transition duration-300 w-[200px] h-[40px]">
              Student
            </Button>
          </Link>

          <div className="flex items-center mt-8">
            <p className="text-sm font-inter">
              Administrator, you don’t have an account?{" "}
              <Link
                to="/administration/register"
                className="text-blue-600 text-sm"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="hidden md:block w-1/2">
          <img
            className="object-cover w-full h-full rounded-r-xl"
            src={image}
            alt="Login Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginAs;
