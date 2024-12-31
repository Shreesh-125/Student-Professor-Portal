import express from "express";
import {
  addExtraClass,
  addPattern,
  changePassword,
  deletePdf,
  getCourseDetails,
  getCoursesByProfCode,
  getPattern,
  getSchedule,
  getStudentsByCourse,
  getUploadedPdf,
  login,
  logout,
  microsoftLogin,
  removePattern,
  updateAttendance,
  uploadPdf,
} from "../controllers/Professor.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import fileUpload from "express-fileupload";
import passport from "passport";

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").get(logout);

// Microsoft authentication route
router.get('/auth/microsoft', passport.authenticate('professor-microsoft'));

router.get(
  '/auth/callback',
  passport.authenticate('professor-microsoft', { failureRedirect: '/api/v1/auth/failure' }),
  microsoftLogin
);

// Failure route
router.get('/auth/failure', (req, res) => {
  res.status(400).json({
    message: 'Microsoft authentication failed!',
    success: false,
  });
});


router.route("/:id").get(isAuthenticated,getSchedule)

router.route("/courses/getcourses/:id").get(isAuthenticated, getCoursesByProfCode);
router.route("/courses/:courseCode").get(isAuthenticated, getCourseDetails);
router.route("/courses/:courseCode/students").get(isAuthenticated, getStudentsByCourse);
router.route("/courses/:courseCode/uploadpdf").post(isAuthenticated, fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }), uploadPdf);
router.route("/courses/:courseCode/deletepdf/:pdfid").delete(isAuthenticated, deletePdf);
router.route("/courses/:courseCode/getpdf").get(isAuthenticated,getUploadedPdf)

router.route("/courses/:courseCode/addExtraClass").post(isAuthenticated,addExtraClass);

router.route("/courses/:courseCode/updatepattern").get(isAuthenticated, getPattern);
router.route("/courses/:courseCode/updatepattern").post(isAuthenticated, addPattern);
router.route("/courses/:courseCode/updatepattern").delete(isAuthenticated, removePattern);


router.route("/courses/:courseCode/attendance").get(isAuthenticated, getStudentsByCourse);
router.route("/courses/:courseCode/attendance/:rollNo").put(isAuthenticated, updateAttendance);

router.route("/changePassword").post(isAuthenticated, changePassword);

export default router;
