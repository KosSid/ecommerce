import {useState, useEffect} from 'react';
import {auth} from '../../firebase'; // from firebase settings
import { toast } from 'react-toastify';
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';

// don't Forget to make settings in the firebase in the project related to email Authentification:
// 1. https://console.firebase.google.com/project/ecommerce-6e346/authentication/providers
// 2. Authentification => sign-in method
// 3. Email/password to make it enabled ....
// 4. make settings for all other like FB and so on...

const Register = () => {
    const [email, setEmail] = useState('');
    const user = useSelector(state => state.user);
    const history = useHistory();

    useEffect(()=> {
        if(user && user.token)  history.push('/');
    }, [user, history]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('ENV ----->>', process.env.REACT_APP_REGISTER_REDIRECT_URL);
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        }

        await auth.sendSignInLinkToEmail(email, config);
        toast.success(`Email is sent to ${email}.
                               Click the link to complete your registartion.`
        );

        // save user email in the local storage
        window.localStorage.setItem('emailForRegistration', email);
        // clear email state
        setEmail(prev => '');
    };

    const registerForm = () => <form onSubmit={handleSubmit}>
        <input
            type="email"
            className={'form-control'}
            value={email}
            onChange={(e) => setEmail(prev => e.target.value)}
            autoFocus
            placeholder={'Register email'}
        />
        <br/>
        <button type={'submit'} className={'btn btn-raised'}>
            Register
        </button>
    </form>;

    return (
        <div className={'container p-5'}>
            <div className={'row'}>
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
}

export default Register;