import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import { industryQualifications } from '../constants/qualifications';
import api from '../../axios/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DetailsInput = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [qualification, setQualification] = useState('');
  const [courses, setCourses] = useState([{ name: '', grade: '' }]);
  
  // Get currentUser and isLoading from AuthContext
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("THe current user is: ", user)
  })

  
  const handleAddNewLine = (e) => {
    e.preventDefault();
    setCourses([...courses, { name: '', grade: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  const handleDeleteLine = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const handleDeleteQuali = () => {
    setSelectedIndustry('');
    setQualification('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const res = await api.post('qualifications/', {
        industry: selectedIndustry,
        name: qualification,
        courses: courses
      });
      
      if (res.data.success) {
        navigate('/dashboard');
      }
    } catch(err) {
      console.error("Error submitting qualifications:", err);
      return {
        success: false, 
        error: err.response ? err.response.data : err.message, 
        message: 'Failed to submit qualifications.'
      };
    }
  };

  // Show loading if we're fetching user data
  if (isLoading || !user) {
    return (
      <div>
        <Header />
        <main>
          <div className='m-4 p-4'>
            <p>Loading user data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <div className='m-4 p-4'>
          <h1 className='text-2xl text-black font-medium'>
            Enter Courses and Respective Grades
          </h1>
          <p className='text-sm text-gray-600 mb-4'>
            Welcome, {user.first_name} {user.last_name}!
          </p>
          
          <form onSubmit={handleSubmit} id='course-form' className='m-4 bg-gray-100 p-4 rounded shadow'>
            <div className='mb-4'>
              <label className='font-semibold text-sm mb-2 block'>Select Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setQualification(''); // reset qual when industry changes
                }}
                className='bg-gray-100 rounded-full px-4 py-2 text-sm w-full'
              >
                <option value="">Select Industry</option>
                {industryQualifications.map((item, index) => (
                  <option key={index} value={item.industry}>{item.industry}</option>
                ))}
              </select>
            </div>

            {selectedIndustry && (
              <div className='flex flex-col bg-white p-5 gap-2 rounded shadow mb-4'>
                <label className='font-semibold text-sm mb-1 text-gray-700'>
                  {selectedIndustry}
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className='bg-gray-100 rounded-full px-4 py-2 text-sm w-full'
                >
                  <option value="">Select Qualification</option>
                  {industryQualifications
                    .find(item => item.industry === selectedIndustry)
                    ?.qualifications.map((qual, qIdx) => (
                      <option key={qIdx} value={qual}>{qual}</option>
                    ))}
                </select>

                <div className="flex gap-2 mt-2">
                  <button type="button" className='bg-gray-100 text-black font-semibold text-sm rounded w-20'>
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteQuali}
                    className='bg-red-500 text-white text-sm font-semibold rounded w-20'
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {qualification && courses.map((course, index) => (
              <div key={index} className='flex justify-between bg-white p-5 gap-2 rounded shadow mb-4'>
                <input
                  value={course.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className='bg-gray-100 rounded-full px-4 py-2 text-sm w-3/4'
                  placeholder='Course Name'
                />
                <input
                  value={course.grade}
                  onChange={(e) => handleInputChange(index, 'grade', e.target.value)}
                  className='bg-gray-100 rounded-full px-4 py-2 text-sm w-1/4'
                  placeholder='Grade/100'
                />
                <button type="button" className='bg-gray-100 text-black font-semibold text-sm rounded w-20'>
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLine(index)}
                  className='bg-red-500 text-white text-sm font-semibold rounded w-20'
                >
                  Delete
                </button>
              </div>
            ))}

            {qualification && (
              <div className='flex gap-2 mt-4'>
                <button 
                  onClick={handleAddNewLine} 
                  type="button"
                  className='bg-red-600 px-4 py-2 text-white rounded-full text-sm'
                >
                  Add New Course
                </button>
                <button 
                  type='submit' 
                  className='bg-green-600 text-white font-semibold rounded-full px-4 py-2'
                >
                  Save all Entries
                </button>
              </div>
            )}
          </form>

        </div>
      </main>
    </div>
  );
};

export default DetailsInput;