# Student Professor Portal

## MERN Stack Project


## About This Portal
This web application is primarily designed to enhance the academic experience for Students and Professors, offering a seamless platform for managing and interacting with course materials, attendance, and academic information.

## Professors:
Professors have access to all the essential tools needed to manage their courses effectively. They can:

View detailed information about the students enrolled in their courses.
Upload PDFs and other resources for students to access.
Modify course patterns, such as updating quizzes, exams, and assignments.
Track and update student attendance.
Ensure that students are always up-to-date with the latest course-related materials and information.


## Students:
Students can easily track their academic progress and stay updated on course activities. They can:

View their attendance details across all the courses they have opted for.
Download PDFs and course materials uploaded by professors.
Access and review course patterns, including quizzes, exams, and other assessments.
Get detailed information about professors and the courses they teach.
While the Administration plays a role in setting up the structure of courses, professors and students are the primary users, benefiting from the streamlined academic management features of this platform. The application fosters better communication, organization, and academic success.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Other Tools**: Axios, Redux


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Setup

## Installation

Follow these steps to set up the project locally:

### Frontend Setup
1. Navigate to the `frontend` folder:  
   ```bash
   cd frontend

Also take a look on .gitignore

## .env file stuff
MONGO_URI=your_mongodb_connection_string
PORT=your_server_port
SECRET_KEY=your_jwt_secret_key
SECRET_CODE=your_secret_code

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_APIKEY=your_cloudinary_api_key
CLOUDINARY_APISECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url

FRONTEND_URL=your_frontend_url

## Running
  cd backend
  yarn dev
  
  cd ..

  cd frontend
  yarn dev

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
