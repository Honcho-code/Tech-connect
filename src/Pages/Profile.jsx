import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  return (
    <div className=" p-4 md:py-2 lg:mx-10">
      <div className="bg-white sticky top-0 py-2 mb-5">
        <div
          className="grid grid-cols-3 items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="p-1 size-8 bg-gray-200 rounded" />
          <img src="/Logo-purple.png" alt="" className="w-52 md:hidden" />
        </div>
      </div>
      <p className='flex justify-center mx-auto'>Comming Soon</p>
    </div>
  )
}

export default Profile