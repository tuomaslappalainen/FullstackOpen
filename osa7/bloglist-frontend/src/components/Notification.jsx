import React from 'react'
import { useNotification } from '../NotificationContext'

const Notification = () => {
  const { state } = useNotification()

  if (state.message === null) {
    return null
  }

  const notificationStyle = {
    color: state.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return (
    <div className={`notification ${state.type}`}>
    <div style={notificationStyle}>
      {state.message}
    </div>
    </div>
  )
}

export default Notification