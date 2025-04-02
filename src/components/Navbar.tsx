import React from 'react';
import { Rocket, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../Auth/Auth';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFav = () => {
    navigate("/favorites")
    handleClose();
  }

  const handleLogout = () => {
    logout(navigate);
    handleClose();
  };

  return (
    <nav className="bg-blue-900">
      <div className="flex items-start justify-between container mx-auto px-4 space-x-4">
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
        {!isLoggedIn() ? (
          <div className="flex mt-4 gap-4">
            <button
              className=" text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className=" text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        ): 
        (
          <div className="flex justify-center mt-4">
             <Button
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              className="hover:bg-gray-100 hover:bg-opacity-10 !text-white"

            >
              <User />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleFav}>Favorites</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
