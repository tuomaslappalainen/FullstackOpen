import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 2 }}>
      {notification}
    </div>
  )
}

export default Notification