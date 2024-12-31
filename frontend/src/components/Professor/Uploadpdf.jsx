import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { MdDelete } from "react-icons/md";

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin border-t-2 border-blue-500 border-solid w-8 h-8 rounded-full" />
);

function UploadPdf() {
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // New loading state for uploading
  const [isDeleting, setIsDeleting] = useState(false); // New loading state for deleting

  const { courseCode } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);

  // Fetch uploaded PDFs on component mount
  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/getpdf`,
            { withCredentials: true }
          );
          setUploadedPdfs(response.data.uploadedPdf); // Updated structure with objects
          console.log(response.data.uploadedPdf);
        } else {
          navigate("/"); // Redirect to login if unauthenticated
        }
      } catch (error) {
        console.error("Error fetching uploaded PDFs:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPdfs();
  }, [courseCode, user, navigate]);

  // Handle PDF upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);
  
      try {
        setIsUploading(true);
  
        const response = await axios.post(
          `${USER_API_END_POINT}/professor/courses/${courseCode}/uploadpdf`,
          formData,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          const newPdf = {
            url: `${response.data.pdfUrl}.pdf`, // Append .pdf to the URL
            name: file.name,
          };
  
          setUploadedPdfs((prev) => [...prev, newPdf]);
          setIsUploadModalOpen(false);
        } else {
          console.error("Failed to upload PDF:", response.data.message);
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Handle PDF delete
  const handleDelete = async () => {
    setIsDeleting(true); // Start deleting process
    try {
      
      
      const pdfId = selectedPdf._id; // Access `url` from the selected PDF object
      const url = selectedPdf.url;
      const response = await axios.delete(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/deletepdf/${pdfId}`,
        {
          data: { pdfUrl: url }, // Send pdfUrl in the request body
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUploadedPdfs((prev) => prev.filter((pdf) => pdf.url !== url));
        setIsDeleteModalOpen(false);
        setSelectedPdf(null);
      } else {
        console.error("Failed to delete PDF:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
    } finally {
      setIsDeleting(false); // End deleting process
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
  {/* Sidebar Component */}
  <Sidebar />
  
  <div className="p-6 flex-1">
    <h1 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2 mb-10 mt-14 md:mt-6">Upload PDF</h1>

    {/* Uploaded PDFs */}
    <div className="flex flex-wrap gap-6">
      {uploadedPdfs.map((pdf, idx) => (
        <div
          key={idx}
          className="relative w-40 h-40 border border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-md"
        >
          <p className="text-center text-sm px-2">{pdf.name}</p>
          <button
            onClick={() => {
              setSelectedPdf(pdf);
              setIsDeleteModalOpen(true);
            }}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
          >
            <MdDelete />
          </button>
        </div>
      ))}

      {/* Add PDF Box */}
      <div
        onClick={() => setIsUploadModalOpen(true)}
        className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <span className="text-gray-400 text-4xl">+</span>
      </div>
    </div>

    {/* Upload Modal */}
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
        </DialogHeader>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isUploading && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner />
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Modal */}
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {selectedPdf?.name}?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>

  );
}

export default UploadPdf;
