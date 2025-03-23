import React from 'react';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../Auth/Auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="bg-blue-900">
      <div className="flex items-center justify-center container mx-auto px-4 space-x-4">
        <div className="flex items-center justify-center h-16">
          <div
            className="flex items-center cursor-pointer group hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <Rocket className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
            <span className="ml-2 text-xl font-bold text-gray-100 group-hover:text-red-500 transition-colors">
              Team Rocket
            </span>
            <span className="ml-2 text-xl font-bold text-red-500 group-hover:text-gray-100 transition-colors">
              Database
            </span>
          </div>
        </div>
        {!isLoggedIn() && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}
        {isLoggedIn() && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => navigate("/favorites")}
            >
              Favoritos
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
