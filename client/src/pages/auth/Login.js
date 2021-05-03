import {useState, useEffect} from 'react';
import {auth, googleAuthProvider} from '../../firebase'; // from firebase settings
import {toast} from 'react-toastify';
import {Button} from 'antd';
import {MailOutlined, GoogleOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {createOrUpdateUser} from '../../functions/auth';

const Login = ({history}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        let intended = history.location.state;
        if (intended) {
            return;
        } else {
            if (user && user.token) history.push("/");
        }
    }, [user, history]);

    const roleBasedRedirect = (res) => {
        // check if intended
        const intended = history.location.state // use for non logged user if they want to rating product, it will back user after login to product page
        console.log('INTENDED', intended);
        if(intended) {
            history.push(intended.from);
        } else {
            if(res.data.role === 'admin') {
                history.push('admin/dashboard');
            } else {
                history.push('user/history')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();

            // function that post token to server and we update or create user on the server
            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    console.log('CREATE OR UPDATE USER LOGIN with PASSWORD ---->>>',res)
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
                    roleBasedRedirect(res); // if it's admin we redirect to Admin page if nor to user/history
                })
                .catch(error => console.log('Error from CREATE or UPDATE USER login with password', error));
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false)
        }
    };

    const googleLogin = async () => {
        setLoading(true)
        try {
            const result = await auth.signInWithPopup(googleAuthProvider);
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();

            // function that post token to server and we update or create user on the server
            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    console.log('CREATE OR UPDATE USER LOGIN with GOOGLE ---->>>',res)
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
                    roleBasedRedirect(res); // if it's admin we redirect to Admin page if nor to user/history
                })
                .catch(error => console.log('Error from CREATE or UPDATE USER login with password', error));
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.message);
        }
    }

    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
                type="email"
                className={'form-control'}
                value={email}
                onChange={(e) => setEmail(prev => e.target.value)}
                autoFocus
                placeholder={'Register email'}
            />
        </div>
        <div className="form-group">
            <input
                type="password"
                className={'form-control'}
                value={password}
                onChange={(e) => setPassword(prev => e.target.value)}
                placeholder={'Register password'}
            />
        </div>
        <br/>
        <Button
            onClick={handleSubmit}
            type={'primary'}
            className={'mb-3'}
            block
            shape={'round'}
            icon={<MailOutlined/>}
            size={'large'}
            disabled={!email || password.length < 6}
        >Login with Email/Password
        </Button>
    </form>;

    return (
        <div className={'container p-5'}>
            <div className={'row'}>
                <div className="col-md-6 offset-md-3">
                    {loading ? <h4 className={'text-danger'}>Loading...</h4> : <h4>Login</h4>}
                    {loginForm()}

                    <Button
                        onClick={googleLogin}
                        type={'danger'}
                        className={'mb-3'}
                        block
                        shape={'round'}
                        icon={<GoogleOutlined/>}
                        size={'large'}
                    >Login with Google
                    </Button>

                    <Link to={'/forgot/password'} className={'float-right text-danger'}>Forgot password</Link>

                </div>
            </div>
        </div>
    );
}

export default Login;