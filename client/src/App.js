import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TopLoadingBar from 'react-top-loading-bar'; // Barra de carga
import './App.css';
import ScrollToTop from './hooks/ScrollToTop/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de páginas.
import Layout from './components/Layout/Layout';
import AccountLayout from './components/AccountLayout/AccountLayout';
import ManagementLayout from './components/ManagementLayout/ManagementLayout';
import Home from './pages/Home/Home';
import AboutUs from './pages/Us/AboutUs';
import Products from './pages/Products/Products';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import AllProducts from './pages/AllProducts/AllProducts';
import AccountInfo from './pages/Account/Account';
import Methods from './pages/Methods/Methods';
import Orders from './pages/Orders/Orders';
import AddMethodForm from './pages/AddMethodForm/AddMethodForm';
import CartPage from './pages/CartPage/CartPage';

import DashBoardHome from './pages/Dashboard/Home/DashBoardHome';
import DashBoardSolds from './pages/Dashboard/Solds/DashBoardSolds';
import DashBoardProducts from './pages/Dashboard/Products/DashBoardProducts';
import DashboardUsers from './pages/Dashboard/Users/DashBoardUsers';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Componente para manejar la barra de carga
function LoadingBarWrapper({ children }) {
    const loadingBarRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
            setTimeout(() => {
                loadingBarRef.current.complete();
            }, 800); // Tiempo ajustable
        }
    }, [location]);

    return (
        <>
            <TopLoadingBar color="#1A729A" ref={loadingBarRef} shadow={true} />
            {children}
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ScrollToTop />
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
                    {/* Encapsulamos las rutas con el wrapper de la barra de carga */}
                    <LoadingBarWrapper>
                        <Routes>
                            <Route path='/' exact element={<Layout><Home /></Layout>} />
                            <Route path='/Nosotros' exact element={<Layout><AboutUs /></Layout>} />
                            <Route path='/Productos' exact element={<Layout><Products /></Layout>} />
                            <Route path='/Contacto' exact element={<Layout><Contact /></Layout>} />
                            <Route path='/Iniciar-Sesion' exact element={<Layout><Login /></Layout>} />
                            <Route path='/Productos/Todos' exact element={<Layout><AllProducts /></Layout>} />
                            <Route path='/Carrito' exact element={<Layout><CartPage /></Layout>} />
                            <Route path='/gestion-cuenta' exact element={<AccountLayout><AccountInfo /></AccountLayout>} />
                            <Route path='/gestion-cuenta/mi-cuenta' exact element={<AccountLayout><AccountInfo /></AccountLayout>} />
                            <Route path='/gestion-cuenta/pagos' exact element={<AccountLayout><Methods /></AccountLayout>} />
                            <Route path='/gestion-cuenta/mis-ordenes' exact element={<AccountLayout><Orders /></AccountLayout>} />
                            <Route path='/gestion-cuenta/pagos/nuevo-metodo' exact element={<AccountLayout><AddMethodForm /></AccountLayout>} />

                            <Route path='/dashboard/inicio' exact element={<ManagementLayout><DashBoardHome /></ManagementLayout>} />
                            <Route path='/dashboard/ventas' exact element={<ManagementLayout><DashBoardSolds /></ManagementLayout>} />
                            <Route path='/dashboard/productos' exact element={<ManagementLayout><DashBoardProducts /></ManagementLayout>} />
                            <Route path='/dashboard/usuarios' exact element={<ManagementLayout><DashboardUsers /></ManagementLayout>} />

                        </Routes>
                    </LoadingBarWrapper>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
