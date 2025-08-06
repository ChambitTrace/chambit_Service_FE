import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './page/login/LoginForm'
import NotFound from './page/error/Error'
import TestPage from './page/testhome/TestPage'
import Dashboard from './page/dashboard/Dashboard'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<TestPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App