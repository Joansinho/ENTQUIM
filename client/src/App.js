import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ScrollToTop from './hooks/ScrollToTop/ScrollToTop';

//importacion de paginas.
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import AboutUs from './pages/Us/AboutUs';
import Products from './pages/Products/Products';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import AllProducts from './pages/AllProducts/AllProducts';
<<<<<<< Updated upstream
=======
import AccountInfo from './pages/Account/Account';
import Methods from './pages/Methods/Methods';
import Orders from './pages/Orders/Orders';
import AddMethodForm from './pages/AddMethodForm/AddMethodForm';
import CartPage from './pages/CartPage/CartPage';

import DashBoardHome from './pages/Dashboard/Home/DashBoardHome';
import DashBoardSolds from './pages/Dashboard/Solds/DashBoardSolds';
import DashBoardProducts from './pages/Dashboard/Products/DashBoardProducts';
import DashboardUsers from './pages/Dashboard/Users/DashBoardUsers';

import AddProduct from './pages/AddProduct/AddProduct';
import AddUser from './pages/AddUser/AddUser';

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
>>>>>>> Stashed changes

function App() {
    return (
        <Router>
            <ScrollToTop/>
                <Routes>
                    <Route path='/' exact element={
                        <>
                        <Layout>
                            <Home/> 
                        </Layout>
                        </>
                    }/>

                    <Route path='/Nosotros' exact element={
                        <>
                        <Layout>
                            <AboutUs/> 
                        </Layout>
                        </>
                    }/>

<<<<<<< Updated upstream
                    <Route path='/Productos' exact element={
                        <>
                        <Layout>
                            <Products/> 
                        </Layout>
                        </>
                    }/>

                    <Route path='/Contacto' exact element={
                        <>
                        <Layout>
                            <Contact/> 
                        </Layout>
                        </>
                    }/>

                    <Route path='/Iniciar-Sesion' exact element={
                        <>
                        <Layout>
                            <Login/> 
                        </Layout>
                        </>
                    }/>

                    <Route path='/Productos/Todos' exact element={
                        <>
                        <Layout>
                            <AllProducts/> 
                        </Layout>
                        </>
                    }/>
                </Routes>
=======
                            <Route path='/dashboard/productos/nuevo-producto' exact element={<ManagementLayout><AddProduct /></ManagementLayout>} />
                            <Route path='/dashboard/usuarios/nuevo-usuario' exact element={<ManagementLayout><AddUser/></ManagementLayout>} />
                        </Routes>
                    </LoadingBarWrapper>
                </CartProvider>
            </AuthProvider>
>>>>>>> Stashed changes
        </Router>
    );
}

export default App;
