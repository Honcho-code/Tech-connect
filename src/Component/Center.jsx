import React from 'react'
import { Outlet } from 'react-router-dom'

const Center = () => {
  return (
    <div className='blcok md:col-span-4 lg:col-span-7'>
        <Outlet/>
    </div>
  )
}

export default Center