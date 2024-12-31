import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./SideBar";
import { Calendar } from "@/components/ui/calendar";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true); // Track authentication check
  const navigate = useNavigate();
  const [derivedSchedule, setDerivedSchedule] = useState({
    classTimes: [],
    extraClasses: [],
    labTimings: [],
    hasLab: false,
  });
  const { user } = useSelector((store) => store.app);
  const [date, setDate] = useState(new Date());

  // Helper function to format dates as "DD-MM-YYYY"
  const formatToDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch professor data
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/${user._id}`,
            { withCredentials: true }
          );
          setSchedule(response.data.schedule);
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

  // Memoize current day and formatted date
  const todayFormattedDate = useMemo(() => formatToDDMMYYYY(date), [date]);
  let dayOfWeek = useMemo(
    () => date.toLocaleString("en-us", { weekday: "long" }),
    [date]
  );

  const handleDateSelect = (selectedDate) => {
    // Ensure that the selected date is a valid Date object
    const newDate = new Date(selectedDate);
    
    // Check if the new date is valid
    if (!isNaN(newDate.getTime())) {
      setDate(newDate);  // Set the new date if it's valid
    } else {
      console.error("Invalid date selected");
    }
  };

  const ScheduleSection = ({ title, items, itemColor }) => (
    <div className="w-full text-center">
      <h3 className="font-bold text-xl text-gray-700">{title}</h3>
      <div className="flex flex-col gap-2 mt-3">
        {items.map((item, index) => (
          <p
            className={`${itemColor} text-white px-4 py-2 rounded-full font-medium shadow-md`}
            key={index}
          >
            {`${item.courseCode} at ${item.time || item.startTime}`}
          </p>
        ))}
      </div>
    </div>
  );


  // Update derived schedule whenever `schedule` or `date` changes
  useEffect(() => {
    if (schedule) {
      const classTimes =
        schedule.classTime?.filter((classItem) => classItem.day === dayOfWeek) ||
        [];
      const extraClasses =
        schedule.extraClass?.filter((extra) => extra.date === todayFormattedDate) ||
        [];
      const labTimings = schedule.hasLab
        ? schedule.labTiming?.filter((lab) => lab.day === dayOfWeek) || []
        : [];
      const hasLab = schedule.hasLab || false;

      setDerivedSchedule({
        classTimes,
        extraClasses,
        labTimings,
        hasLab,
      });
    }
  }, [schedule, dayOfWeek, todayFormattedDate]);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  if (!schedule) {
    return <div>Loading...</div>; // Render loading state if schedule is not yet fetched
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="mt-20 mx-auto px-4 w-full max-w-[900px]">
    <h1 className="text-4xl font-bold mb-12 text-center text-primary">Welcome, Professor!</h1>

    <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
      {/* Professor's Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Use the new handler
          className="rounded-md border shadow-lg p-4 bg-white"
          classNames={{
            day_selected: "bg-blue-600 text-white font-bold rounded-full",
            day_hovered: "hover:bg-blue-200",
            day_today: "bg-blue-500 text-white font-bold rounded-full", // Styling for today's date
          }}
        />
      </div>

      <div className="flex flex-col gap-8">
        {/* Display Classes Today */}
        {derivedSchedule.classTimes.length > 0 && (
              <ScheduleSection
                title="Today's Classes"
                items={derivedSchedule.classTimes}
                itemColor="bg-blue-500"
              />
            )}

        {/* Display Extra Classes Today */}
        {derivedSchedule.extraClasses.length > 0 && (
              <ScheduleSection
                title="Extra Classes Today"
                items={derivedSchedule.extraClasses}
                itemColor="bg-gray-700"
              />
            )}

        {/* Display Lab Sessions */}
        {derivedSchedule.hasLab &&
              derivedSchedule.labTimings.length > 0 && (
                <ScheduleSection
                  title="Lab Sessions Today"
                  items={derivedSchedule.labTimings}
                  itemColor="bg-teal-600"
                />
              )}

        {/* No classes, extra classes, or labs today */}
        {derivedSchedule.classTimes.length === 0 &&
              derivedSchedule.extraClasses.length === 0 &&
              (!derivedSchedule.hasLab ||
                derivedSchedule.labTimings.length === 0) && (
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-600">
                    No Classes, Extra Classes, or Labs Today
                  </h3>
                </div>
              )}
      </div>
    </div>
  </div>
</div>

  );
}

export default Home;
