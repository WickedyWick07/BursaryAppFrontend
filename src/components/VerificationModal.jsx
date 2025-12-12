import React, { useEffect, useState } from 'react'
import api from '../../axios/api'

const VerificationModal = ({ onClose }) => {
  const [profilePicture, setProfilePicture] = useState(null)
  const [transcripts, setTranscripts] = useState([])
  const [idDocument, setIdDocument] = useState(null)
  const [qualification, setQualification] = useState(null)

  useEffect(() => {
    const fetchQualification = async () => {
      try {
        const res = await api.get('qualifications/list/')
        if (res.data.success && res.data.data.length > 0) {
          setQualification(res.data.data[0])
        }
      } catch (error) {
        console.error('Error fetching qualification:', error)
      }
    }

    fetchQualification()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!qualification) return

    const formData = new FormData()
    if (idDocument) formData.append('id_document', idDocument)
    if (profilePicture) formData.append('profile_photo', profilePicture)
    if (transcripts.length > 0) {
      transcripts.forEach((file, i) => {
        formData.append(`transcript`, file) // Django can handle multiple files as same field name
      })
    }
    formData.append('is_verified', true) // mark user as verified

    try {
      const res = await api.patch(
        `qualifications/${qualification.id}/update/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (res.status === 200) {
        alert('You are now verified!')
        onClose()
      }
    } catch (error) {
      console.error('Something went wrong while submitting', error)
      alert('Failed to update qualification.')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          ×
        </button>

        <h1 className="text-2xl font-semibold mb-4">Verification Modal</h1>
        <p className="text-gray-600 mb-6">
          Please upload the missing documents to verify your qualification.
        </p>

        {qualification ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input
                type="text"
                value={qualification.industry}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Qualification</label>
              <input
                type="text"
                value={qualification.name}
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload ID Document</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setIdDocument(e.target.files[0])}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transcripts</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => setTranscripts([...e.target.files])}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificationModal
