import { useState } from "react";
import { IconType } from "react-icons";
import { getIcon } from "../utils/getIcons";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useSession from "../customHooks/useSession";

interface MenuItem {
  title: string;
  src?: string;
  icon?: IconType;
  gap?: boolean;
  path: string;
}

interface SidebarProps {
  menus: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menus }) => {
  const [open, setOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { destroySession, sessionData } = useSession();

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(()=> {
      destroySession();
      navigate("/");
    }, 500);
  };

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-white h-screen p-5 pt-8 relative duration-300 ease-in-out flex flex-col`}
      >
        <img
          src="./src/assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full transition-transform duration-300 ease-in-out ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center justify-center flex-col">
          <img
            src="Nexus.svg"
            className={`cursor-pointer transition-transform duration-500 ease-in-out h-11`}
          />
          <h1
            className={`text-primaryLila origin-left font-medium text-lg transition-transform duration-200 ease-in-out ${
              !open && "scale-0"
            }`}
          >
            Nexus
          </h1>
        </div>
        <ul className="pt-6 flex-grow">
          {menus.map((menu, index) => {
            const Icon = menu.icon || getIcon(menu.title);
            const isActive = location.pathname === menu.path; 
            return (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-sm items-center gap-x-4 transition-colors duration-200 ease-in-out ${
                  menu.gap ? "mt-9" : "mt-2"
                } ${index === 0 && "bg-light-white"}`}
                onClick={() => navigate(menu.path)}
              >
                <Icon className={`text-lg flex-shrink-0 ${isActive ? "text-primaryLila" : "text-gray-600"}`} />
                <span
                  className={`origin-left transition-opacity duration-200 ease-in-out ${
                    !open ? "opacity-0 w-0" : "opacity-100 w-auto"
                  } ${isActive ? "text-primaryLila font-semibold" : "text-gray-600"}`}
                >
                  {menu.title}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto mb-4">
          <div className="h-full">
            <div className="flex gap-2 items-center">
              <div className="w-12 h-12 flex-shrink-0">
                <img
                  className="w-full h-full aspect-square rounded-full"
                  src="profile.jpg"
                  alt="User"
                />
              </div>
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  !open ? "opacity-0 w-0" : "opacity-100 w-auto"
                } flex gap-5`}
              >
                <div className="flex flex-col items-start justify-center">
                  <div>
                    <span className="font-semibold whitespace-nowrap">
                      {sessionData.user.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-light">{sessionData.user.profile}</span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 cursor-pointer text-red-500 transition-all ${
                    isLoggingOut ? "opacity-0 duration-1000" : "hover:scale-150 hover:opacity-65"
                  }`}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-lg" />
                </div>
              </div>
              <div className="w-2/12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;