import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './componenets/layout/Navbar.jsx'
import Home from './componenets/home/Home.jsx'
import Footer from './componenets/layout/Footer.jsx'
import Login from './componenets/pages/auth/Login.jsx'
import Signup from './componenets/pages/auth/Signup.jsx'
import JobsPage from './componenets/jobs/JobsPage.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/employer/login" element={<Login defaultRole="employer" />} />
          <Route path="/employer/signup" element={<Signup defaultRole="employer" />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

