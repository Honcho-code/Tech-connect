import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Bell, Bookmark, Home, LogOut, Plus, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../config/firebase'
import { useAuthStore } from '../store/authStore'

const LeftSidebar = ({ postModal, setPostModal }) => {
    const navigate = useNavigate()
    const {logout, error, loading, user} = useAuthStore()

    const handleLogout = async()=>{
        await logout()
    }
    useEffect(()=>{
        if(!user){
            navigate("/login")
        }
    },[user,navigate])
    const baseClass =
    "flex gap-3 text-white items-center py-3 rounded-lg lg:px-4 lg:py-3 hover:bg-[#7E1CAE] transition-all duration-300 border-2 border-[#9306D9] cursor-pointer";
  const activeClass = "bg-[#7E1CAE] border-white";
  return (
    <div className='hidden md:block md:col-span-1 lg:col-span-3 w-full bg-[#9306D9] px-4 py-4 lg:py-7 h-screen  sticky top-0 bottom-0'>
        <img src="/T-C.png" alt="" className='block lg:hidden' />
        <img src="/Logo-white.png" alt="" className='hidden lg:block w-40' />
            <div className='flex-col flex gap-5 mt-8 lg:mt-10 lg:mx-auto'>
                <NavLink to={'/'} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
                    <Home className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Home</p>
                </NavLink>
                <NavLink to={'/bookmarks'} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
                    <Bookmark className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Bookmarks</p>
                </NavLink>
                <NavLink to={'/notification'} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
                    <Bell className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Notifications</p>
                </NavLink>
                <NavLink to={'/profile'} className={({isActive})=>isActive ? `${baseClass} ${activeClass}` : `${baseClass}`}>
                    <User className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Profile</p>
                </NavLink>
            </div>
            <div className='absolute bottom-6 left-6 right-6 flex-col flex gap-5'>
                <div className="flex gap-3 text-black items-center text-center justify-center py-3 rounded-lg lg:rounded-full lg:px-4 lg:py-3 bg-white border-2 border-[#9306D9]  cursor-pointer" onClick={()=>setPostModal(true)}>
                    <Plus className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Create post</p>
                </div>
                <div className="flex gap-3 text-white items-center py-3 rounded-lg lg:px-4 lg:py-3 hover:bg-[#7E1CAE] transition-all duration-300 border-2 border-[#9306D9]  cursor-pointer" onClick={handleLogout}>
                    <LogOut className='size-6 lg:size-5 md:mx-auto lg:mx-0'/>
                    <p className='hidden lg:block'>Logout</p>
                </div>
            </div>
    </div>
  )
}

export default LeftSidebar