import {useEffect, useState} from 'react';
import {Route} from 'react-router-dom';
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import {currentAdmin} from "../../functions/auth";


const  AdminRoute = ({...rest }) => {
    const user = useSelector( state => state.user);
    const [ok, setOk] = useState(false)

    useEffect(() => {
        if(user && user.token) {
            currentAdmin(user.token)
                .then(res => {
                    console.log('CURRENT ADMIN RESPONSE', res);
                    setOk(true);
                })
                .catch(err => {
                    console.log('CURRENT ADMIN RESPONSE', err);
                    setOk(false);
                })
        }
    }, [user])


    // check if user exist and he is not empty (token is not empty)
    return ok  ?
        <Route {...rest} />
        :
        <LoadingToRedirect/>
}

export default AdminRoute;