import React from 'react'
const LoadingIcon = () => {
  return (
    <div>
      <div>
        <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.343A8.001 8.001 0 0112 20v-4a4 4 0 00-3.07-3.857l-1.997 6.2z"></path>
        </svg>
      </div>
    </div>
  )
}

export default LoadingIcon
