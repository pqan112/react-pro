import React from 'react'
import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'

export default function UserLayout() {
  return (
    <>
      <UserSideNav />
      <Outlet />
    </>
  )
}
