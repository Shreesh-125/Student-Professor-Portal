import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UploadedPdf() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/uploadedpdf`,
            { withCredentials: true }
          );
          setUploadedPdfs(response.data.uploadedPdf);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching uploaded PDFs:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPdfs();
  }, [courseCode, user, navigate]);

  const getDownloadUrl = (pdf) => {
    if (!pdf.url || !pdf.name) {
      console.error('Invalid PDF data:', pdf);
      return '#';
    }
    return `${pdf.url}?fl_attachment=${encodeURIComponent(pdf.name)}`;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
  <Sidebar />
  <div className="p-6 flex-1">
    <h1 className="text-3xl font-extrabold mb-10 border-b-4 border-blue-500 pb-2 text-blue-900 mt-10 md:mt-0">Uploaded PDFs</h1>
    {loading ? (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    ) : (
      <div className="flex flex-wrap gap-6">
        {uploadedPdfs.map((pdf, idx) => (
          <div
            key={idx}
            className="relative w-44 h-44 border border-gray-300 rounded-lg flex flex-col items-center justify-between bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <div className="p-4 flex-1 flex flex-col justify-center items-center">
              <p className="text-center text-sm font-semibold px-2 truncate">{pdf.name}</p>
            </div>
            <a
              href={getDownloadUrl(pdf)}
              download={pdf.name}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
}

export default UploadedPdf;
