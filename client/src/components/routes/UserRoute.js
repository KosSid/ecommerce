import {Route} from 'react-router-dom';
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";


const  UserRoute = ({...rest }) => {
    const user = useSelector( state => state.user);
    // check if user exist and he is not empty (token is not empty)
    return user && user.token ?
        <Route {...rest}/>
        :
        <LoadingToRedirect/>
}

export default UserRoute;