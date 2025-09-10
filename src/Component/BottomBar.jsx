import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Bookmark, Home, LogOut, Plus, User } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'



const BottomBar = ({ postModal, setPostModal }) => {
  const navigate = useNavigate()
  const handleLogout = async()=>{
    signOut(auth)
    navigate("/login")
  }
  const baseClass =
    "flex flex-col gap-1 text-gray-500 items-center";
  const activeClass = "text-purple-800 font-bold";
  return (
    <div className={`block md:hidden fixed bottom-0 w-full backdrop:blur-lg border border-gray-500 rounded-t-3xl bg-white px-5 py-6 ${postModal ? "z-0" : "z-10"}`}>
      <div className='flex items-center justify-between'>
        <NavLink to={"/"} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
          <Home/>
        </NavLink>
        <NavLink to={"/notification"} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
          <Bell/>
        </NavLink>
        <div  className="bg-[#7E1CAE] text-white px-3 py-3 rounded-full" onClick={()=>setPostModal(true)}>
          <Plus/>
        </div>
        <NavLink to={"/bookmarks"} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
          <Bookmark/>
        </NavLink>
        <div  className="text-gray-500" onClick={handleLogout}>
          <LogOut/>
        </div>
      </div>
    </div>
  )
}

export default BottomBar