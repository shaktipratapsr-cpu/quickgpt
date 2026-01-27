import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Loading.css'

const Loading = ({ delay = 3000, message = 'Loading' }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      try { navigate('/app') } catch (e) {}
    }, delay)
    return () => clearTimeout(timeout)
  }, [delay, navigate])

  return (
    <div className="loading-page" role="status" aria-live="polite">
      <div className="loading-inner">
        <div className="loading-spinner" aria-hidden="true"></div>
        <div className="loading-message">{message}...</div>
        <div className="loading-sub">Please wait a moment</div>
      </div>
    </div>
  )
}

export default Loading
