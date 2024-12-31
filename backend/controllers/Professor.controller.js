import cloudinary from "../cloudinary/cloudinary.js";
import { Courses } from "../models/Courses.model.js";
import { Professor } from "../models/Professor.model.js";
import { Student } from "../models/student.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export  const login=async(req,res)=>{
    try {
      const {instituteMailId,password}=req.body;
      if(!instituteMailId || !password){
        return res.status(400).json({
          message:"All the fields are nedded",
          success:false
          
        })
      }

      const sanitizedinstituteMailId = String(instituteMailId).trim().toLowerCase();
        
        const sanitizedPassword = String(password).trim();

      let professor= await Professor.findOne({instituteMailId:sanitizedinstituteMailId});

      if(!professor){
        return res.status(400).json({
          message:"Institude Mail Id not found",
          success:false
        })
      }

      const isPasswordMatched= await bcrypt.compare(sanitizedPassword,professor.password);

      if(!isPasswordMatched){
        return res.status(400).json({
          message:"Incorrect Password",
          success:false
        })
      }

       const tokenData={
          userId:professor._id
      }
      const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

      professor={
          _id:professor._id,
          fullname:professor.fullname,
          instituteMailId:professor.instituteMailId,
      }

      return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
          message:`Welcome back!! `,
          user:professor,
          success:true
      })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }
}

export const logout = async(req,res)=>{
  try {
    return res.status(200).cookie("token","",{maxAge:0}).json({
      message:"Logged out Successfully",
      success:true
  })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const microsoftLogin = async (req, res) => {
  try {
    // Extract the email from the Microsoft profile
    const microsoftEmail = req.user.emails[0]?.value;

    if (!microsoftEmail) {
      return res.status(400).json({
        message: "Email not found in Microsoft profile.",
        success: false,
      });
    }

    // Check if this email exists in the database
    let professor = await Professor.findOne({ instituteMailId: microsoftEmail });

    if (!professor) {
      return res.status(404).json({
        message: "User not found. Please register first.",
        success: false,
      });
    }

    // Generate JWT token for the user
    const tokenData = {
      userId: professor._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    // Prepare user data for response
    professor = {
      _id: professor._id,
      instituteMailId: professor.instituteMailId,
    };

    // Send the token as a cookie and user details in the response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back, ${professor.instituteMailId}!`,
        user: professor,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong during the authentication process.",
      success: false,
    });
  }
};

export const getSchedule= async(req,res)=>{
  try {
    const profId=req.params.id;
   
    
    const professor= await Professor.findById(profId).populate("courses");

    let schedule=[];
    let extraClass=[];
    let labTiming=[];
    let haslab=false;
    professor.courses.forEach((course)=>{
      course.classTiming.forEach(time=>{
        schedule.push({
          day:time.day,
          time:time.time,
          _id:time._id,
          courseCode:course.courseCode
        });
      })
      course.extraClass.forEach(time=>{
        extraClass.push({
          date:time.date,
          time:time.time,
          _id:time._id,
          courseCode:course.courseCode
        });
      })

      if(course.hasLab){
        haslab=true;
        course.labTiming.forEach(time=>{
          labTiming.push({
            day:time.day,
            startTime:time.startTime,
            endTime:time.endTime,
            _id:time._id,
            courseCode:course.courseCode
          });
        })
      }
    })

 

    return res.status(200).json({
      message:"Schedule Fetched Successfully",
      success:true,
      schedule:{
        classTime:schedule,
        extraClass:extraClass,
        hasLab:haslab,
        labTiming:labTiming
      }
    })
    
    
  } catch (error) {
    console.log("Error While Fetching Schedule");
    
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
    
  }
}


export const getStudentsByCourse = async (req, res) => {
  try {
    // Get the course name from the request query
    const { courseCode } = req.params;

    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: "Course code is required",
      });
    }

    const course= await Courses.findOne({courseCode});
    
    if(!course){
      return res.status(404).json({
        message:"Course Not found",
        success:false
      })
    }


    // Find students who have opted for the given course
    const students = await Student.find({ coursesOpted: { $elemMatch: { $eq: course._id } } });

    let modifiedStudents=[];

    students.forEach(std=>{
      let attendance=100;
      std.courseAttendance.forEach(obj=>{
        if(obj.course.equals(course._id)){
          attendance=obj?.attendance;
        }
      })
      modifiedStudents.push({
        fullName:std?.fullname,
        rollNo:std?.rollNo,
        instituteMailId:std?.instituteMailId,
        number:std?.number,
        attendance:attendance
      })
    })

   

    // Return the details of the students
    return res.status(200).json({
      success: true,
      students:modifiedStudents,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getCourseDetails = async (req, res) => {
  try {
    const { courseCode } = req.params;

    if (!courseCode) {
      return res.status(400).json({
        success: false,
        message: "Course code is required",
      });
    }

    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"Course Not found",
        success:false
      })
    }


    // Find students who have opted for the given course
    const students = await Student.find({ coursesOpted: { $elemMatch: { $eq: course._id } } });

    // Prepare response data
    const courseDetails = {
      totalStudents: students.length,
      courseCode: courseCode,
      courseName:course.name
    };

    return res.status(200).json({
      message: "Course Details Fetched Successfully",
      success: true,
      courseDetails: courseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getCoursesByProfCode= async (req,res)=>{
  try {
      const profId= req.params.id;

      const professor=await Professor.findById(profId);

      const courses=await Courses.find({professor : {$elemMatch:{$eq:profId}}});

      const modifiedcourses=[];
      courses.map((course)=>modifiedcourses.push(course.courseCode));

      return res.status(200).json({
        success:true,
        courses:modifiedcourses
      })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const changePassword= async(req,res)=>{
  try {
    const {password}=req.body;

    if(!password){
      return res.status(400).json({
        message:"Please enter the Password",
        success:false,
      })
    }

    const profId= req.id;

    const professor=await Professor.findById(profId);

    const hashedPassword= await bcrypt.hash(password,10);

    professor.password=hashedPassword;

    await professor.save();

    return res.status(200).json({
      success:true,
      message:"Password Updated Successfully"
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const addExtraClass =async (req,res)=>{
  try {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-"); // Converts to "DD-MM-YYYY"

    const {courseCode}=req.params;
    const {date,time}= req.body;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time for the extra class are required.",
        success: false,
      });
    }

    // Validate date format (DD-MM-YYYY)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!date.match(dateRegex)) {
      return res.status(400).json({
        message: "Invalid date format. Use DD-MM-YYYY.",
        success: false,
      });
    }

    // Validate time format (HH:MM AM/PM)
    const timeRegex = /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/;
    if (!time.match(timeRegex)) {
      return res.status(400).json({
        message: "Invalid time format. Use HH:MM AM/PM.",
        success: false,
      });
    }

    const course = await Courses.findOne({
      courseCode,
    });

    course.extraClass = course.extraClass.filter((extraClass) => {
      const [day, month, year] = extraClass.date.split("-").map(Number);
      const extraClassDate = new Date(year, month - 1, day);
      return extraClassDate >= currentDate; // Keep only future or current date classes
    });

    course.extraClass.push({ date, time });

    const students = await Student.find({ coursesOpted: { $elemMatch: { $eq: course._id } } });

    if (!students.length) {
      return res.status(404).json({
        message: "No students have opted for this course",
        success: false,
      });
    }

    const allCourses = Array.from(
      new Set(students.flatMap((student) => student.coursesOpted))
    );

    let courses=[];

    await Promise.all(
      allCourses.map(async(id)=>{
        const course= await Courses.findById(id);
        if(course)courses.push(course);
      })
    )

    if (!courses.length) {
      return res.status(404).json({
        message: "No courses found for the students",
        success: false,
      });
    }

    const getWeekday = (dateString) => {
      const [day, month, year] = dateString.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", { weekday: "long" });
    };

     // Extract extraClass and classTiming conflicts
     const conflicts = [];
     const extraClassWeekday = getWeekday(date);
     

     courses.forEach((otherCourse) => {
      if (otherCourse.courseCode === courseCode) return; // Skip the current course

      // Check conflicts with classTiming of other courses
      otherCourse.classTiming.forEach((classTime) => {
        if (
          classTime.day === extraClassWeekday && // Match weekday
          classTime.time === time // Match time
        ) {
          conflicts.push({
            conflictType: "classTiming",
            courseCode: otherCourse.courseCode,
            conflictDay: classTime.day,
            conflictTime: classTime.time,
          });
        }
      });

      // Check conflicts with extraClass of other courses
      otherCourse.extraClass.forEach((otherExtraClass) => {
        if (
          otherExtraClass.date === date && // Match date
          otherExtraClass.time === time // Match time
        ) {
          conflicts.push({
            conflictType: "extraClass",
            courseCode: otherCourse.courseCode,
            conflictDate: otherExtraClass.date,
            conflictTime: otherExtraClass.time,
          });
        }
      });
    });

    // If conflicts exist, do not add the new extra class
    if (conflicts.length > 0) {
      return res.status(409).json({
        message: "Conflict detected. Extra class cannot be added.",
        conflicts,
        success: false,
      });
    }

    // Save the course with the new extra class
    await course.save();

    return res.status(200).json({
      message: "Extra class added successfully.",
      success: true,
    });

 


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while adding the extra class.",
      success: false,
    });
  }
}

export const getUploadedPdf = async (req, res) => {
  try {
    const { courseCode } = req.params;

    // Find the course by courseCode
    const course = await Courses.findOne({ courseCode });

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        success: false,
      });
    }


    return res.status(200).json({
      message: "Course pdf retrieved successfully.",
      uploadedPdf: course.uploadedPdf,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while retrieving the pdf.",
      success: false,
    });
  }
};

export const uploadPdf = async (req, res) => {
  try {
    const { courseCode } = req.params;

    // Ensure the file exists in the request
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a PDF file.",
        success: false,
      });
    }

    // Extract the file from the request
    const file = req.files.pdf;

    // Upload the file to Cloudinary using the tempFilePath
    const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "raw", // For PDF and other non-image file types
    });

    // Find the course and update its uploadedPdf field
    const course = await Courses.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        success: false,
      });
    }

    // Add the uploaded PDF's URL and name to the uploadedPdf array
    
    course.uploadedPdf.push({
      url: uploadedFile.secure_url,
      name: file.name,
    });
    await course.save();

    return res.status(200).json({
      message: "PDF uploaded successfully!",
      pdfUrl: uploadedFile.secure_url,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while uploading the PDF.",
      success: false,
    });
  }
};


export const deletePdf = async (req, res) => {
  try {
    const { courseCode,pdfid } = req.params;
    // const { pdfUrl } = req.body; // URL of the PDF to delete


    // Find the course
    const course = await Courses.findOne({ courseCode });
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
        success: false,
      });
    }

    // Check if the PDF exists in the course
    const pdfIndex = course.uploadedPdf.findIndex((pdf) => pdf._id.equals(pdfid));
    if (pdfIndex === -1) {
      return res.status(404).json({
        message: "PDF not found in course.",
        success: false,
      });
    }
    const pdfUrl=course.uploadedPdf[pdfIndex].url;
    
    // Extract the public ID of the PDF from the URL
    const publicId = pdfUrl.split("/").pop().split(".")[0];

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Remove the PDF object from the uploadedPdf array
    course.uploadedPdf.splice(pdfIndex, 1);
    await course.save();

    return res.status(200).json({
      message: "PDF deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while deleting the PDF.",
      success: false,
    });
  }
};




export const getPattern= async (req,res)=>{
  try {
    const {courseCode}=req.params;

    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"Course not found",
        success:false
      })
    }

    return res.status(200).json({
      message:"Pattern Found",
      pattern:course.pattern,
      success:true,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false,
    })
    
  }
}

export const addPattern= async (req,res)=>{
  try {
    const {courseCode}=req.params;

    

    const {pattern}= req.body;

    if(!pattern || !pattern.name || !pattern.weightage){
      return res.status(400).json({
        message:"Pattern name and weightage is required",
        success:false
      })
    }

    let totalweightage=0;
    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"Course Not Found",
        success:false
      })
    }

    
    
    (course.pattern || []).forEach(pat=>{
      totalweightage+=pat.weightage;
     
      
    })

    totalweightage+=Number(pattern.weightage);
   
    
    if(totalweightage>100){
      return res.status(400).json({
        message:"Total Weightage is exceeding",
        success:false
      })
    }

    course.pattern.push(pattern);

    await course.save();

    return res.status(200).json({
      message:"Pattern Updated Successfully",
      success:true,
      pattern:course.pattern
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const removePattern= async(req,res)=>{
  try {
    const {courseCode}=req.params;

    const {patternId}= req.body;

    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"course not found",
        success:false
      })
    }

    course.pattern=course.pattern.filter(pat=>pat._id!=patternId);
    

    await course.save();

    return res.status(200).json({
      message:"Pattern removed Successfully",
      pattern:course.pattern,
      success:true,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const updateAttendance = async (req, res) => {
  try {
    const { courseCode, rollNo } = req.params;
    const { attendance } = req.body;

    const course = await Courses.findOne({ courseCode });

    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
        success: false,
      });
    }

    if (attendance === undefined || attendance === null) {
      return res.status(400).json({
        message: "Enter the attendance",
        success: false,
      });
    }

    if (attendance > 100) {
      return res.status(400).json({
        message: "Attendance cannot be more than 100%",
        success: false,
      });
    }

    const student = await Student.findOne({ rollNo });

    let isStudent = false;

    student.courseAttendance.forEach((obj) => {
      if (obj.course.equals(course._id)) {
        obj.attendance = attendance;
        obj.lastUpdated = new Date(); // Update the lastUpdated field
        isStudent = true;
      }
    });

    if (!isStudent) {
      return res.status(400).json({
        message: `Student ${rollNo} is not opted for this ${courseCode} course`,
        success: false,
      });
    }

    await student.save();

    return res.status(200).json({
      message: "Attendance Updated Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
