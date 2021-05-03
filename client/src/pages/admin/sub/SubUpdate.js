import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {createSub, removeSub, updateSub, getSub} from '../../../functions/sub';
import {getCategories} from '../../../functions/category'
import {Link} from "react-router-dom";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";


const SubUpdate = ({match, history}) => {
    const user = useSelector(state => state.user);
    const [name, setName] = useState('');
    const [loading, setLoading] =useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState(''); // //it's parent category from Select

    useEffect(() => {
        loadCategories();
        loadSub();
    },[]);

    const loadCategories = () => {
        return getCategories().then((c) => {
                setCategories(c.data);
            }
        );
    }

    const loadSub = () => {
        return getSub(match.params.slug).then((s) => {
                setName(s.data.name);
                setParent(s.data.parent)
            }
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // we put the name of category and token and call create function that returns Promise that we can operate with then or async await
        // name is object!!!
        updateSub(match.params.slug,{name: name, parent: parent}, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" is updated`);
                history.push('/admin/sub')
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            })
    }

   return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Sub Category update</h4>}

                    <div className="form-group">
                        <label htmlFor={'catForSub'} style={{fontWeight:'bold'}}>Select Parent Category</label>
                        <select
                            name="category"
                            id="catForSub"
                            className={'form-control'}
                            onChange={e => setParent(e.target.value)}
                        >
                            <option>--Please Select--</option>
                            {categories.length > 0 && categories.map(c => {
                                return (
                                    <option
                                        key={c._id}
                                        value={c._id}
                                        selected={c._id === parent}
                                    >
                                        {c.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}/>
                </div>
            </div>
        </div>
    );
}

export default SubUpdate;