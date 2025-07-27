import React, { useContext, useState } from 'react'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign-Up');
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentState === 'Sign-Up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    try {
      const isSuccess = await login(currentState === 'Sign-Up' ? 'signup' : 'login', { fullName, email, password, bio });
      console.log("Login success status:", isSuccess);
      if (isSuccess) {
        console.log("Navigating to home...");
        navigate('/'); 
      }
    } catch (error) {
      console.error('Login/Register failed:', error);
    }

  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} alt="" className='w-50' />
      {/* right */}
      <form onSubmit={onSubmitHandler} className=' border-2 text-white border-gray-500 flex flex-col gap-6 w-[min(30w,400px)] bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold flex justify-between items-center'>{currentState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} className='w-4 cursor-pointer' alt="" />}

        </h2>

        {currentState === 'Sign-Up' && !isDataSubmitted && (
          <input value={fullName} onChange={(e) => setfullName(e.target.value)} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-200' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-200' placeholder='Email' required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-200' placeholder='Password' required />

          </>
        )}
        {currentState === 'Sign-Up' && isDataSubmitted && (
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-200' placeholder='Bio' required />
        )}
        <button type='submit' className='bg-violet-500/30 text-white p-2 rounded-lg cursor-pointer hover:bg-violet-500/50 transition-colors duration-300'>
          {currentState === 'Sign-Up' ? "Create Account" : "Login"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-400'>
          <input type="checkbox" required />
          <p>Agree to the term of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentState === 'Sign-Up' ? (
            <p>Already have an account? <span onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'>Login Here</span> </p>
          ) : (
            <p>Don't have an account? <span onClick={() => { setCurrentState("Sign-Up") }} className='font-medium text-violet-500 cursor-pointer'>Sign Up</span> </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login