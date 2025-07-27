import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const Profile = () => {
  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImage, setselectedImage] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if(!selectedImage) {
      await updateProfile({bio, fullName: name})
      navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, bio, fullName: name})
      navigate('/');
    } 
    
  }



  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl flex items-center text-gray-300 justify-center max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={onSubmitHandler} action="" className='flex flex-col gap-4 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label className='flex items-center gap-3 cursor-pointer' htmlFor="avatar">
            <input onChange={(e) => setselectedImage(e.target.files[0])} type="file" name="" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-14 h-14 ${selectedImage && 'rounded-full'}`} />
            Upload Profile Picture
          </label>
          <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea value={bio} onChange={(e) => { setBio(e.target.value) }} name="" id="" cols="30" rows="4" required placeholder='Your Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
          <button className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 text-lg rounded-full cursor-pointer' type='submit'>Save</button>

        </form>
        <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' src={authUser?.profilePic ||assets.logo_icon} alt="" />
      </div>
    </div>
  )
}


export default Profile