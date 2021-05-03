import React, {useEffect} from 'react'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Switch, Route} from 'react-router-dom';
import 'antd/dist/antd.css';

import {auth} from './firebase';
import {useDispatch} from "react-redux";
import {currentUser} from './functions/auth';

import Header from "./components/nav/Header";
import UserRoute from './components/routes/UserRoute';
import AdminRoute from "./components/routes/AdminRoute";
import SideDrawer from "./components/drawer/SideDrawer";

import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';
import Home from '../src/pages/Home';
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";
import History from "./pages/user/History";
import Password from "./pages/user/Password";
import Whishlist from "./pages/user/Whishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import AllProducts from "../src/pages/admin/product/AllProducts";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubHome from "./pages/sub/SubHome";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
import Payment from "./pages/Payment";


const App = () => {

    const dispatch = useDispatch();

    //to check firebase auth state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('APP (user obj from firebase)----------->', user)
            if(user) {
                const idTokenResult = await user.getIdTokenResult();
                currentUser(idTokenResult.token)
                    .then((res) => {
                        console.log('get USER data from /current-user end point ---->>>',res)
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id
                            }
                        });
                    })
                    .catch(error => console.log('Error from get /current-user endpoint', error));
            }
        })
        return () => unsubscribe();
    },[dispatch])

    return (
        <>
            <Header/>
            <SideDrawer/>
            <ToastContainer/>
            <Switch>
                <Route exact path={'/'} component={Home}/>
                <Route exact path={'/register'} component={Register}/>
                <Route exact path={'/register/complete'} component={RegisterComplete}/>
                <Route exact path={'/login'} component={Login}/>
                <Route exact path={'/forgot/password'} component={ForgotPassword}/>
                <UserRoute exact path={'/user/history'} component={History}/>
                <UserRoute exact path={'/user/password'} component={Password}/>
                <UserRoute exact path={'/user/wishlist'} component={Whishlist}/>
                <AdminRoute exact path={'/admin/dashboard'} component={AdminDashboard}/>
                <AdminRoute exact path={'/admin/category'} component={CategoryCreate}/>
                <AdminRoute exact path={'/admin/category/:slug'} component={CategoryUpdate}/>
                <AdminRoute exact path={'/admin/sub'} component={SubCreate}/>
                <AdminRoute exact path={'/admin/sub/:slug'} component={SubUpdate}/>
                <AdminRoute exact path={'/admin/product'} component={ProductCreate}/>
                <AdminRoute exact path="/admin/products" component={AllProducts} />
                <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}/>
                <Route exact path={'/product/:slug'} component={Product}/>
                <Route exact path={'/category/:slug'} component={CategoryHome}/>
                <Route exact path={'/sub/:slug'} component={SubHome}/>
                <Route exact path={'/shop'} component={Shop}/>
                <Route exact path={'/cart'} component={Cart}/>
                <Route exact path={'/checkout'} component={Checkout}/>
                <AdminRoute exact path={'/admin/coupon'} component={CreateCouponPage}/>
                <UserRoute exact path={'/payment'} component={Payment}/>
            </Switch>
        </>
    );
}


export default App;
