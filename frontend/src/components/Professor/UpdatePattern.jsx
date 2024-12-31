import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { USER_API_END_POINT } from '@/utils/constant';

function UpdatePattern() {
  const { user } = useSelector((store) => store.app);
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', weightage: '', note: '' });

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/updatepattern`,
            { withCredentials: true }
          );
          setPattern(response.data.pattern);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching pattern data:', error);
        navigate('/');
      }
    };

    fetchPattern();
  }, [user, courseCode, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.weightage) {
      alert('Name and Weightage are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/updatepattern`,
        { pattern: formData },
        { withCredentials: true }
      );
      setPattern((prev) => [...prev, formData]);
      setFormData({ name: '', weightage: '', note: '' });
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error updating pattern:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to update pattern.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <div className="mb-6">
          <h2 className="text-4xl font-extrabold text-blue-900 border-b-4 border-blue-500 pb-2  mt-14 md:mt-6">Update Pattern</h2>
        </div>

        <div className="mt-6">
          
          {pattern.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pattern.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-lg shadow-lg bg-white flex flex-col gap-2 transform hover:scale-105 transition-transform duration-200"
                >
                  <p className="text-lg font-bold text-gray-700">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Weightage:</span> {item.weightage}%
                  </p>
                  {
                    item?.note ? <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note:</span> {item.note || 'No note provided'}
                  </p>:""
                  }
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No patterns added yet.</p>
          )}
        </div>

        <div
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-10 w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
        >
          <span className="text-gray-400 text-4xl">+</span>
        </div>

        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Pattern</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                >
                  <option value="" disabled>
                    Select Name
                  </option>
                  <option value="Quiz">Quiz</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Mid-Sem Exam">Mid-Sem Exam</option>
                  <option value="End-Sem Exam">End-Sem Exam</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Weightage</label>
                <input
                  type="number"
                  name="weightage"
                  value={formData.weightage}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Note</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default UpdatePattern;
