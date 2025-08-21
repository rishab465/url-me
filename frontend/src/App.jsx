import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import React from 'react'
import Home from "./pages/Home.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from "./pages/SignupPage.jsx"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "dashboard" element={<Dashboard/>}/>
        <Route path = "loginpage" element={<LoginPage/>}/>
        <Route path = "signuppage" element={<SignupPage/>}/>
        

      </Routes>
    </Router>
  )
}

export default App