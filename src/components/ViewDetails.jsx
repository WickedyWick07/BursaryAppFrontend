import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { AuthContext } from "../context/AuthContext";

const ViewDetails = () => {
  const { user } = useContext(AuthContext);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("The current user is:", user);

    const fetchDetails = async () => {
      try {
        const res = await api.get("qualifications/list/");
        console.log("results:", res);
        setDetails(res.data.data);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Go Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        Qualification Details
      </h1>

      {/* Qualifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail) => (
          <div
            key={detail.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
          >
            {/* Header Section */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
              <img
                src={`http://localhost:8000${detail.profile_photo}`}
                alt={detail.name}
                className="w-20 h-20 object-cover rounded-full border"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {detail.name}
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Industry:</span>{" "}
                  {detail.industry}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    detail.is_verified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {detail.is_verified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>

            {/* Courses Section */}
            <div className="p-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">
                Courses & Grades
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-3 py-2">Course</th>
                      <th className="px-3 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.courses.map((course, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2">{course.name}</td>
                        <td className="px-3 py-2 font-medium">
                          {course.grade}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Document Previews */}
              <div className="mt-5">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Uploaded Documents
                </h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      ID Document:
                    </p>
                    <img
                      src={`http://localhost:8000${detail.id_document}`}
                      alt="ID Document"
                      className="w-full h-40 object-contain rounded-md border"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Transcript:
                    </p>
                    <img
                      src={`http://localhost:8000${detail.transcript}`}
                      alt="Transcript"
                      className="w-full h-40 object-contain rounded-md border"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDetails;
