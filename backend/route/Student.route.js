import express from "express";
import { changePassword, getAttendance, getcourseDetails, getCourses, getPattern, getProfessorDetails, getSchedule, getUploadedPdf, login, logout, microsoftLogin } from "../controllers/Student.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import passport from "passport";
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
const router = express.Router();


router.route('/login').post(login);

router.get('/auth/microsoft', passport.authenticate('student-microsoft'));

// Student Strategy
passport.use(
  'student-microsoft',
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/student/auth/callback`,
      scope: ['user.read'],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

router.get(
  '/auth/callback',
  passport.authenticate('student-microsoft', { failureRedirect: '/api/v1/auth/failure' }),
  microsoftLogin
);

// Failure route
router.get('/auth/failure', (req, res) => {
  res.status(400).json({
    message: 'Microsoft authentication failed!',
    success: false,
  });
});

router.route("/:id").get(isAuthenticated,getSchedule);

router.route('/courses/getcourses/:id').get(isAuthenticated,getCourses);
router.route('/courses/:courseCode').get(isAuthenticated,getcourseDetails);
router.route('/courses/:courseCode/uploadedpdf').get(isAuthenticated,getUploadedPdf);
router.route('/courses/:courseCode/pattern').get(isAuthenticated,getPattern)  //// remaining
router.route('/courses/:courseCode/professorDetails').get(isAuthenticated,getProfessorDetails)///////////////reminaing

router.route('/attendance/:id').get(isAuthenticated,getAttendance);
router.route('/changePassword').post(isAuthenticated,changePassword);

export default router;