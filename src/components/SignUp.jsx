import { useState, useContext } from 'react'
import signupPic from '../assets/images/signup.jpg'
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

const SignUp = () => {
  const [login_Form, setLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState()
  const {register, login} = useContext(AuthContext)

  const toggleRegister = () => {
    setLoginForm(!login_Form)
  }

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const {first_name, last_name, email, password} = formData;
      if (login_Form){
        const response = await login(email, password);
        if(!response.success){
          setError('Login failed. Please check your credentials.');
        } else if(response.success){
          if(response.user.is_staff){
            navigate('/admin-dashboard');
            setLoading(false)
            return;
          } else{
            setLoading(false)
            navigate('/dashboard');

          }
        } else {
          console.error('Login failed:', response.message);
        }
      }
      // if not loggin in, we are registering the user 
      if(!login_Form){
        try {
          const response = await register(first_name, last_name, email, password);
          setLoading(false)
          if(response.success){
          
              const successLogin = await login(email, password);
              if(successLogin.success){
                setLoading(false) 
                navigate('/academic-details');
              } else{
                setError('Registration successful but login failed. Please try logging in again.');
                return;
              }
            
          }
        } catch (error) {
          console.log("an error occured during the registration process :", error);
          setError('An error occurred while registering. Please try again later.');
          setLoading(false);
          return;
          
        }
      }
      
    } catch (error) {
      setError(error)
      console.error("There was an error", error)
    }

  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value} )
  }

  

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100 py-8'>
      <section className='mb-6'>
        <img
          className='w-full h-48 object-cover rounded-full shadow-lg'
          src={signupPic}
          alt='Sign Up'
        />
      </section>

      <section className='w-full max-w-md'>
        <div className='mb-6'>
          <h1 className='text-3xl text-gray-800 text-center font-bold'>
            Bursary Finder
          </h1>
        </div>

        <div>
          <form onSubmit={handleAuthentication} className='bg-gray-300 rounded-lg shadow-md p-6 space-y-4'>
            <div className='flex justify-between mb-4'>
              <button
                type='button'
                onClick={() => setLoginForm(true)}
                className={`${
                  login_Form
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-black hover:bg-gray-600'
                } font-light rounded-full px-4 py-2 text-sm transition`}
              >
                Login
              </button>
              <button
                type='button'
                onClick={toggleRegister}
                className={`${
                  !login_Form
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-black hover:bg-gray-600'
                } font-light rounded-full px-4 py-2 text-sm transition`}
              >
                Register
              </button>
            </div>

            {!login_Form && (
              <>
                <input
                  placeholder='First Name'
                  className='w-full border rounded bg-gray-100 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
                  onChange={handleChange}
                  name='first_name'
                />
                <input
                  placeholder='Last Name'
                  className='w-full border rounded bg-gray-100 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
                  onChange={handleChange}
                  name='last_name'

                />
              </>
            )}

            <input
              placeholder='Email'
              className='w-full border rounded bg-gray-100 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
              onChange={handleChange}
              name='email'

            />
            <input
              placeholder='Password'
              type='password'
              className='w-full border rounded bg-gray-100 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500'
              onChange={handleChange}
              name='password'

            />

            <div className='mt-4'>
              <button
                type='submit'
                className='w-full bg-red-500 text-white font-medium rounded px-4 py-2 text-sm hover:bg-red-600 transition'
              >
                {loading ? <p>Submitting...</p> : <p>Submit</p>}
              </button>
            </div>
          </form>
        </div>
        {error && <p className='text-red-500 text-center text-md font-medium'>{error}</p>}
      </section>
    </div>
  )
}

export default SignUp
