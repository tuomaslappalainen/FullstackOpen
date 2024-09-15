import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification) {
    return null
  }

  return (
    <div style={{  padding: 10}}>
      {notification}
    </div>
  )
}

export default Notification