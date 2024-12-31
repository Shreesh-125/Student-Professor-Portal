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

  // Fetch student data
  useEffect(() => {
    const fetchstudentData = async () => {
      try {
        const response = await axios.get(
          `${USER_API_END_POINT}/student/${user._id}`,
          { withCredentials: true }
        );
        setSchedule(response.data.schedule);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false); // Stop loading after authentication check
      }
    };

    if (user && user._id) {
      fetchstudentData();
    }
  }, [user]);

  // Memoize current day and formatted date
  const todayFormattedDate = useMemo(() => formatToDDMMYYYY(date), [date]);
  let dayOfWeek = useMemo(
    () => date.toLocaleString("en-us", { weekday: "long" }),
    [date]
  );

  // Update derived schedule whenever `schedule` or `date` changes
  useEffect(() => {
    if (schedule) {
      const classTimes =
        schedule.classTime?.filter(
          (classItem) => classItem.day === dayOfWeek
        ) || [];
      const extraClasses =
        schedule.extraClass?.filter(
          (extra) => extra.date === todayFormattedDate
        ) || [];
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
  }, [schedule]);

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleDateSelect = (selectedDate) => {
    // Ensure that the selected date is a valid Date object
    const newDate = new Date(selectedDate);

    // Check if the new date is valid
    if (!isNaN(newDate.getTime())) {
      setDate(newDate); // Set the new date if it's valid
    } else {
      console.error("Invalid date selected");
    }
  };

  if (loading) {
    return null;
  }

  if (!schedule) {
    return <div>Loading...</div>; // Render loading state if schedule is not yet fetched
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="mt-20 mx-auto w-[900px] px-4">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">
          Welcome, {user?.fullname || "Student"}!
        </h1>

        <div className="flex flex-col gap-16 lg:flex-row">
          {/* Student's Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect} // Use the new handler
              className="rounded-md border shadow-md"
              classNames={{
                day_selected: "bg-blue-600 text-white font-bold rounded-full",
                day_hovered: "hover:bg-blue-200",
                day_today: "bg-blue-500 text-white font-bold rounded-full", // Styling for today's date
              }}
            />
          </div>

          {/* Schedule Details */}
          <div className="flex flex-col gap-4 items-center">
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

            {/* No Classes, Extra Classes, or Labs Today */}
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
