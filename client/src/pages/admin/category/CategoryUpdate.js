import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {updateCategory, getCategory} from '../../../functions/category';
import CategoryForm from "../../../components/forms/CategoryForm";
// import {useParams} from 'react-router-dom'; we have 2 ptions get params (slug) => match and hook



const CategoryUpdate = ({history, match}) => {
    const user = useSelector(state => state.user);
    const [name, setName] = useState('');
    const [loading, setLoading] =useState(false);
    const slug = match.params.slug;
    // const slug = useParams(); get slug using hhoks


    useEffect(() => {
        loadCategory()
    },[]);

    const loadCategory = () => {
        return getCategory(slug).then((c) => {
                setName(c.data.name);
            }
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // we put the name of category and token and call create function that returns Promise that we can operate with then or async await
        // name is object!!!
        updateCategory(slug,{name}, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" is updated`);
                history.push('/admin/category');
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
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Category update</h4>}
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
                    <hr/>
                </div>
            </div>
        </div>
    );
}

export default CategoryUpdate;