import React, { useState } from 'react'

const LoginForm = ({ handleLogin}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault();
   handleLogin(username, password)
  };

   return (
     <div>
       <h2>Login to application</h2>
 
       <form onSubmit={onSubmit}>
         <div>
           Username
           <input
           type='text'
             value={username}
             onChange={({ target }) => setUsername(target.value)}
           />
         </div>
         <div>
           Password
           <input
             type="password"
             value={password}
             onChange={({ target }) => setPassword(target.value)}
           />
       </div>
         <button type="submit">Login</button>
       </form>
     </div>
   )
 }
 
 export default LoginForm