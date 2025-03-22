import { Routes, Route } from 'react-router-dom';
import  Home  from './pages/Home'
import  RegisterPage  from './pages/RegisterPage'
import  Login  from './pages/Login'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  return(
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;