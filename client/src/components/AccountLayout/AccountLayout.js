import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderManagement from '../HeaderManagement/HeaderManagement';
import SideBarNavigation from '../SideBarNavigation/SideBarNavigation';
import Images from '../../utils/Images/Images';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

const AccountLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación

  // Define el menú de navegación
  const accountMenu = useMemo(() => [
    { 
      name: 'Mi cuenta', 
      paths: ['/gestion-cuenta/mi-cuenta', '/gestion-cuenta'], 
      selectedIcon: Images.icons.personselected, 
      unselectedIcon: Images.icons.personunselected 
    },
    { 
      name: 'Pagos', 
      path: '/gestion-cuenta/pagos', 
      selectedIcon: Images.icons.paymentsselected, 
      unselectedIcon: Images.icons.paymentsunselected
    },
    {
      name: 'Órdenes',
      path: '/gestion-cuenta/mis-ordenes',
      selectedIcon: Images.icons.reportselected,
      unselectedIcon: Images.icons.reportunselected
    }
  ], []);

  // Función para obtener la sección activa basada en la ruta
  const getInitialSection = () => {
    const activeMenuItem = accountMenu.find(item => 
      (item.paths && item.paths.includes(location.pathname)) || 
      item.path === location.pathname
    );
    return activeMenuItem ? activeMenuItem.name : 'Mi cuenta';
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
          name: user?.nombre, // Asumiendo que tienes un avatar para el usuario
          role: user?.id_rol === 1 ? 'Administrador' : user?.id_rol === 2 ? 'Empleado' : 'Cliente' 
        }} // Solo pasa el avatar y rol
      />
      {children}
    </div>
  );
};

export default AccountLayout;
