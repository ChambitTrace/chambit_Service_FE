import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './page/login/LoginForm'
import NotFound from './page/error/Error'
import TestPage from './page/dashboard/TestPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/404" element={< NotFound />} />
        <Route path="*" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App