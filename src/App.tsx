import { Routes, Route } from 'react-router-dom';
import  Home  from './pages/Home'
import  RegisterPage  from './pages/RegisterPage'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  return(
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;