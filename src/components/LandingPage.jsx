import React from 'react'
import coverpage from '../assets/images/coverpage.jpg'
import coverpage2 from '../assets/images/coverpage2.jpg'
import { CheckCircle, Briefcase, Users } from 'lucide-react';
import Header from './Header';

const LandingPage = () => {
return (
        <div className='bg-white'>
                       <Header />
                        <main>  
                                        <section style={{ 
                                                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${coverpage})`, 
                                                backgroundSize: 'cover', 
                                                backgroundPosition: 'center', 
                                                height: '80vh' 
                                        }} className='flex items-center p-5 '>
                                                        <div className='flex flex-col text-left'>
                                                                        <p className="text-5xl font-semibold text-white pb-4">
                                                                                        Let Your Grades Speak For You!
                                                                        </p>
                                                                        <p className='text-md text-medium text-white pb-4'>
                                                                                        Simplify finding funding for tertiary studies by letting us apply for you!
                                                                        </p>
                                                                        <div className=''>
                                                                                        <button className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded shadow-lg transition duration-300'>
                                                                                                        Get Started
                                                                                        </button>
                                                                        </div>
                                                        </div>
                                        </section>  
                                        <section className='flex flex-col justify-center items-center p-5'>
                                                <div className='mb-6'>
                                                        <h2 className='text-3xl font-semibold'>Benefits of Funding!</h2>
                                                </div>
                                                <div className='grid grid-cols-3 md:grid-cols-3 gap-6 w-full'>
                                                        <div className='bg-gray-100 p-4 rounded shadow'>
                                                                <div className='flex items-center mb-2'>
                                                                        <CheckCircle className='text-blue-600 mr-2' />
                                                                        <h3 className='text-xl font-semibold'>Reduced Financial Burden</h3>
                                                                </div>
                                                                <p className='text-sm'>
                                                                        Funding helps alleviate the stress of tuition fees, accommodation, and other expenses, allowing you to focus on your studies.
                                                                </p>
                                                        </div>
                                                        <div className='bg-gray-100 p-4 rounded shadow'>
                                                                <div className='flex items-center mb-2'>
                                                                        <Briefcase className='text-blue-600 mr-2' />
                                                                        <h3 className='text-xl font-semibold'>Access to Better Opportunities</h3>
                                                                </div>
                                                                <p className='text-sm'>
                                                                        With financial support, you can access quality education and resources that might otherwise be out of reach.
                                                                </p>
                                                        </div>
                                                        <div className='bg-gray-100 p-4 rounded shadow'>
                                                                <div className='flex items-center mb-2'>
                                                                        <Users className='text-blue-600 mr-2' />
                                                                        <h3 className='text-xl font-semibold'>Networking and Mentorship</h3>
                                                                </div>
                                                                <p className='text-sm'>
                                                                        Many funding programs provide access to mentorship and networking opportunities, helping you build a strong career foundation.
                                                                </p>
                                                        </div>
                                                </div>
                                        </section>
                                        <section className="flex justify-center items-center p-5 bg-blue-800 m-5">
                                                <div className='flex w-full'>
                                                        <div className='w-1/2 p-5'>
                                                                <p className='text-2xl text-white py-4 font-semibold'>We keep track of everything for you</p>
                                                                <p className='text-white text-sm font-light'>For just a fee, we will do all the applying for you so you can just focus on your educational journey!</p>
                                                                <div className=' mt-20'>
                                                                        <button className='bg-white hover:bg-gray-200 text-blue-600 text-sm font-light py-2 px-6  shadow-lg transition duration-300'>
                                                                                        Get Started for free
                                                                        </button>
                                                                </div>
                                                        </div>
                                                        <div className='w-1/2'>
                                                                <img src={coverpage2} className='w-full object-cover  h-full' /> 
                                                        </div>
                                                </div>
                                        </section>
                                        <section></section>
                        </main>
        </div>
)
}

export default LandingPage
