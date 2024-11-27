import React, { useState } from 'react';
import { profile,line,on, off, newini, home , init , create, log_out} from "../../assets"
import { useAppKit } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const NavbarApp: React.FC = () => {

  const { open} = useAppKit()
  const {  isConnected } = useAppKitAccount()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate =useNavigate();
  const dispatch=useDispatch();

    const {user} = useSelector((state: RootState) => state.auth);

    const handleButton = () => {
        return( alert("Aqui deberia ir el trabajo del Designer >:v/") )
    }

    function handleOut(){
      dispatch(logout())
      alert("Deslogueo exitoso")
      navigate("/")
    }

  return (
    <div className=" bg-white flex items-center justify-between p-4 shadow-sm h-[72px]">
      <div className="flex-1">
      <div className="flex items-center sm:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>


      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-white shadow-lg z-50 sm:hidden">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-4 min-h-screen">
            <a href="#" className="flex items-center text-lg font-semibold p-2 hover:bg-gradient-to-br from-blue-700 to-sky-400 rounded hover:text-white"><img src={home} className='m-1'/>Home</a>
            <a href="#" className="flex items-center text-lg font-semibold p-2 hover:bg-gradient-to-br from-blue-700 to-sky-400 rounded hover:text-white"><img src={create} className='m-1'/>Create New</a>
            <a href="#" className="flex items-center text-lg font-semibold p-2 hover:bg-gradient-to-br from-blue-700 to-sky-400 rounded hover:text-white"><img src={newini} className='m-1'/>New Initiatives</a>
            <a href="/initiatives" className="flex items-center text-lg font-semibold p-2 hover:bg-gradient-to-br from-blue-700 to-sky-400 rounded hover:text-white"><img src={init} className='m-1'/>Iniciatives</a> <br/><br/><br/><br/><br/><br/><br/><br/>
            
            <button 
            className="flex items-end text-lg font-semibold p-2 hover:bg-gradient-to-br from-blue-700 to-sky-400 mt-auto rounded hover:text-white"
            onClick={handleOut}
            >
                <img src={log_out} className='m-1 h-[25px] w-[25px]'/>
                    Log out
                </button>
          </div>
        </div>
      )}

      </div>

      <div className="flex items-center space-x-4 justify-end m-4">
        <div className='mr-[2.5em] lg:mr-0'>
          <button
            onClick={() => open()}  
          >
            <img 
             src={isConnected ? on : off}
            alt="wallet" />
          </button>
        </div>

        <div>
          <img src={line} alt="Line" />
        </div>

        <button className="flex flex-row gap-2" onClick={handleButton}>
          <div>
            <img 
              src={profile} 
              alt="profile" 
              className="w-[30px] h-[30px] rounded-full" 
            />
          </div>
        
          <div className=" font-semibold text-black text-sm p-1">
          {user?.name && user?.lastName ? `${user.name} ${user.lastName}` : 'Loading...'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavbarApp;
