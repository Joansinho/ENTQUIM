import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderManagement from '../HeaderManagement/HeaderManagement';
import SideBarNavigation from '../SideBarNavigation/SideBarNavigation';
import Images from '../../utils/Images/Images';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

const ManagementLayout = ({children}) => {
    const location = useLocation()
    const { user } = useAuth();

    const accountMenu = useMemo(() => [
        { 
          name: 'Inicio', 
          paths: ['/dashboard/inicio', '/gestion-cuenta'], 
          selectedIcon: Images.icons.homeselected, 
          unselectedIcon: Images.icons.homeunselected
        },
        { 
          name: 'Ventas', 
          path: '/dashboard/ventas', 
          selectedIcon: Images.icons.soldselected, 
          unselectedIcon: Images.icons.soldunselected
        },
        {
          name: 'Productos',
          path: '/dashboard/productos',
          selectedIcon: Images.icons.productsselected,
          unselectedIcon: Images.icons.productsunselected
        },
        {
            name: 'Usuarios',
            path: '/dashboard/usuarios',
            selectedIcon: Images.icons.usersselected,
            unselectedIcon: Images.icons.usersunselected
        }
      ], []);

      const getInitialSection = () => {
        const activeMenuItem = accountMenu.find(item => 
          (item.paths && item.paths.includes(location.pathname)) || 
          item.path === location.pathname
        );
        return activeMenuItem ? activeMenuItem.name : 'Inicio';
      };
    
      const [activeSection, setActiveSection] = useState(getInitialSection);
    
      useEffect(() => {
        setActiveSection(getInitialSection());
      }, [location.pathname, accountMenu]);

    return (
        <div>
            <HeaderManagement />
            <SideBarNavigation 
                menuNavigation={accountMenu}
                setActiveSection={setActiveSection}
                activeSection={activeSection}
                user={{ 
                avatar: Images.icons.personselected,
                name: user?.nombre,
                role: user?.id_rol === 1 ? 'Administrador' : user?.id_rol === 2 ? 'Empleado' : 'Cliente' 
            }} // Solo pasa el avatar y rol
          />
          {children}
        </div>
      );
}

export default ManagementLayout;