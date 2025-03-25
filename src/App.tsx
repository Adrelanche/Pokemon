import { Routes, Route } from 'react-router-dom';
import  Home  from './pages/Home'
import  RegisterPage  from './pages/RegisterPage'
import  Login  from './pages/Login'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Favorites from './pages/Favorites';
import ProtectedRoute from "./Auth/ProtectedRoute";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  return(
    <div>
      <DndProvider backend={HTML5Backend}>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<ProtectedRoute Component={Favorites} path="/favorites" />} />
        </Routes>
        <Footer/>
      </DndProvider>
    </div>
  )
}

export default App;