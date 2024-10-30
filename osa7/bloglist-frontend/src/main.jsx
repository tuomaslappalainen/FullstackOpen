import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NotificationProvider } from './NotificationContext'
import { UserProvider } from './UserContext'
import { BrowserRouter as Router } from 'react-router-dom'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(

    <Router>

<QueryClientProvider client={queryClient}>

<UserProvider>

<NotificationProvider>

<App />

</NotificationProvider>

</UserProvider>

</QueryClientProvider>

</Router>

)