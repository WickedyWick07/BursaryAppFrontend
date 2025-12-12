import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center bg-white-500 text-blue-500 p-4'>
    <div className='flex items-center gap-4'>
                    <h1 className='text-2xl text-black font-bold'>Bursary Finder</h1>
                    <nav>
                                    <ul>	
                                                    <li  className='flex gap-4  text-sm font-semibold'>
                                                                    <a href="/">Home</a>
                                                                    <a href="/details-input">Where do I qualify</a>
                                                                    <a href="/bursary-providers">Bursary Providers</a>
                                                                                     
                                                    </li>
                                    </ul>
                    </nav>
    </div>

    <div className='border border-white rounded bg-blue-600 py-2 px-6 mx-4 '>
                    <button className='text-white text-sm font-semibold'>
                                    <a href="/signup">Sign Up</a>
                    </button>
    </div>
</div>
  )
}

export default Header
