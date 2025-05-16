import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface Props { children: ReactNode }

export default function PrivateRoute({ children }: Props) {
  const token = localStorage.getItem('token')
  const loc = useLocation()

  return token
    ? <>{children}</>
    : <Navigate to="/login" state={{ from: loc }} replace />
}