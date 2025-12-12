// ...existing code...
import React, { useEffect, useState, useContext } from 'react'
import api from '../../axios/api'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import VerificationModal from '../components/VerificationModal'
import placeholder from '../assets/images/placeholder-image.png'
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const [qualifications, setQualifications] = useState([])
  const [userMatches, setUserMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [verificationModal, setShowVerificationModal] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const matchesPerPage = 6
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL

  // Build full media URL
  const getMediaUrl = (path) => {
    if (!path) return '/default-profile.png'
    return `path`
  }

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await api.get('qualifications/list/')
        setQualifications(response.data.data || [])
      } catch (error) {
        console.error(error)
      }
    }

    const getUserMatches = async () => {
      try {
        const response = await api.get('bursary/matches/')
        // normalize to array
        const matches = Array.isArray(response.data.matches)
          ? response.data.matches
          : Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : []
        console.log(matches)
        setUserMatches(matches)
      } catch (error) {
        console.error('An error occurred: ', error)
        alert('Something went wrong')
        setUserMatches([])
      }
    }

    getUserMatches()
    fetchQualifications()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [userMatches])

  const handleSearch = async () => {
    try {
      setLoading(true)
      const response = await api.post('/bursary/search/')
      const matches = Array.isArray(response.data.matches)
        ? response.data.matches
        : Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : []
      setUserMatches(matches)
    } catch (error) {
      console.error('Search error:', error)
      alert('Something went wrong during search')
      setUserMatches([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Safe userMatches for pagination calculations
  const safeUserMatches = Array.isArray(userMatches) ? userMatches : []
  const indexOfLastMatch = currentPage * matchesPerPage
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage
  const currentMatches = safeUserMatches.slice(indexOfFirstMatch, indexOfLastMatch)
  const totalPages = Math.max(1, Math.ceil(safeUserMatches.length / matchesPerPage))

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(p)
  }
  const handlePrev = () => goToPage(currentPage - 1)
  const handleNext = () => goToPage(currentPage + 1)

  const firstQualification = qualifications[0] || {}
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                firstQualification?.profile_photo
                  ? `${API_URL}${firstQualification.profile_photo}`
                  : placeholder
              }
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />

            {/* Verified Blinker */}
            {firstQualification.is_verified ? (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-ping border border-white"></span>
            ): (  
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping border border-white"></span>
            )}
          </div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.first_name || 'User'} 👋
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/user-details')}
            className="bg-blue-500 text-sm rounded px-3 py-2 text-white hover:bg-blue-600 transition"
          >
            View User Details
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-sm rounded px-3 py-2 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-3 rounded-lg font-semibold text-white transition 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? 'Searching...' : '🔍 Search for Bursaries'}
        </button>
      </div>

      {/* Match Count */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium">
          🎯 Bursaries Matched: <span className="font-bold">{safeUserMatches.length}</span>
        </p>
        {safeUserMatches.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Showing {safeUserMatches.length === 0 ? 0 : indexOfFirstMatch + 1}-{Math.min(indexOfLastMatch, safeUserMatches.length)} of {safeUserMatches.length}
          </p>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Searching for relevant bursaries...</p>
        </div>
      )}

      {/* Matches List */}
      {!loading && currentMatches.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {currentMatches.map((match, index) => (
              <div
                key={match.id || index}
                className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{match.title}</h3>

                {match.match_quality && (
                  <div className="mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        match.match_quality === 'Excellent Match'
                          ? 'bg-green-100 text-green-800'
                          : match.match_quality === 'Very Good Match'
                          ? 'bg-blue-100 text-blue-800'
                          : match.match_quality === 'Good Match'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {match.match_quality}
                      {match.relevance_score && ` (${match.relevance_score})`}
                    </span>
                  </div>
                )}

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {match.description?.slice(0, 120)}...
                </p>

                <div className="flex justify-between items-center">
                  <a
                    href={match.application_url || match.url}
                    className="inline-block bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Bursary →
                  </a>

                  <button
                    onClick={() => {
                      if (!firstQualification.is_verified) {
                        setShowVerificationModal(match.id);
                      } else {
                        toast.success("Already verified");
                      }
                    }}
                    className="bg-red-500 text-white rounded font-medium text-sm py-2 px-3 hover:bg-red-600 transition cursor-pointer"
                  >
                    Apply for me
                  </button>
                </div>

                {verificationModal === match.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 relative">
                      <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                        onClick={() => setShowVerificationModal(false)}
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <VerificationModal onClose={() => setShowVerificationModal(false)} />
                    </div>
                  </div>
                )}

                {match.matched_on && (
                  <p className="text-xs text-gray-500 mt-3">
                    Matched: {new Date(match.matched_on).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>

              {/* show a window of pages */}
              {(() => {
                const pages = []
                const start = Math.max(1, currentPage - 2)
                const end = Math.min(totalPages, start + 4)
                for (let p = start; p <= end; p++) {
                  pages.push(
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`px-3 py-1 rounded ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  )
                }
                return pages
              })()}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && safeUserMatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bursaries found. Try searching!</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
// ...existing code...