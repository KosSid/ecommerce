import React, {useState} from "react";
import UserNav from "../../components/nav/UserNav";
import {auth} from '../../firebase';
import {toast} from "react-toastify";

const Password = () => {

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);
        //get currently logged user from firebase and update his password
        await auth.currentUser.updatePassword(password)
            .then(() => {
                setLoading(false);
                toast.success('Password updated');
            })
            .catch(err => {
                setLoading(false);
                toast.error(err.message);
            })
    }

    const passwordUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className={'form-group'}>
                <label htmlFor={'pass'}>Enter new Password</label>
                <input
                    type="password"
                    id={'pass'}
                    onChange={e => setPassword(e.target.value)}
                    className={'form-control'}
                    placeholder={'password'}
                    disabled={loading}
                    value={password}
                />
                <button
                    className={'btn btn-primary'}
                    disabled={!password || loading || password.length < 6}
                >Submit</button>
            </div>

        </form>
    )

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    {loading ? <h4 className={'danger-text'}>Loading...</h4> : <h4>Password Update</h4>}
                    {passwordUpdateForm()}
                </div>
            </div>
        </div>
    )
}

export default Password;