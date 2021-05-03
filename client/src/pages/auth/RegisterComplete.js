import {useState, useEffect} from 'react';
import {auth} from '../../firebase'; // from firebase settings
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from "react-redux";
import {createOrUpdateUser} from '../../functions/auth';

const RegisterComplete = ({history}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(()=> {
        setEmail(prev => window.localStorage.getItem('emailForRegistration'))
    }, []);

    useEffect(()=> {
        if(user && user.token)  history.push('/');
    }, [user, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //validation of inputs forms
        if(!email || !password) {
            toast.error('email and password is required');
            return;
        }

        if(password.length < 6) {
            toast.error('password length is less than 6 symbols');
            return;
        }

        try {
            const result = await auth.signInWithEmailLink(email,window.location.href);

            if(result.user.emailVerified) {
                // 1. remove user email from local storage
                window.localStorage.removeItem('emailForRegistration');

                // 2. get user id token
                let user = auth.currentUser; // get currently locked user from the filrebase
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();

                // 3. redux store
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        console.log('UPDATE USER from server when we Register ---->>>',res)
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
                    .catch(error => console.log('Error from CREATE or UPDATE USER login with password', error));

                // 4. redirect
                history.push('/')
            }

        } catch(err) {
            console.log(err);
            toast.error(err.message)
        }

    };

    const completeRegistrationForm = () => <form onSubmit={handleSubmit}>
        <input
            type="email"
            className={'form-control'}
            value={email}
            onChange={(e) => setEmail(prev => e.target.value)}
            disabled
            placeholder={'Email'}
        />
        <br/>
        <input
            type="password"
            className={'form-control'}
            value={password}
            onChange={(e) => setPassword(prev => e.target.value)}
            autoFocus
            placeholder={'Password'}
        />
        <br/>
        <button type={'submit'} className={'btn btn-raised'}>
            Complete Registration
        </button>
    </form>;

    return (
        <div className={'container p-5'}>
            <div className={'row'}>
                <div className="col-md-6 offset-md-3">
                    <h4>Register Complete</h4>
                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    );
}

export default RegisterComplete;