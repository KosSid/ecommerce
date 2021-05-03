import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {createSub, removeSub, updateSub, getSubs} from '../../../functions/sub';
import {getCategories} from '../../../functions/category'
import {Link} from "react-router-dom";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubCreate = () => {
    const user = useSelector(state => state.user);
    const [name, setName] = useState('');
    const [loading, setLoading] =useState(false);
    const [categories, setCategories] = useState([]);
    const [category,setCategory] = useState('');  //it's parent category from Select
    const [subs, setSubs] = useState([]);

    // for filtering STEP 1
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
        loadSubs();
    },[]);

    const loadCategories = () => {
        return getCategories().then((c) => {
                // console.log(c);
                setCategories(c.data);
            }
        );
    }

    const loadSubs = () => {
        return getSubs().then((s) => {
                setSubs(s.data);
            }
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // we put the name of category and token and call create function that returns Promise that we can operate with then or async await
        // name is object!!!
        createSub({name: name, parent: category}, user.token)
            .then(res => {
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" is created`);
                loadSubs();
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            })
    }

    const handleRemove = async (slug) => {
        const answer = window.confirm('Delete');
        if (answer) {
            setLoading(true);
            removeSub(slug, user.token)
                .then(res => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadSubs();
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    if (err.response.status === 400) toast.error(err.response.data);
                } )
        }
    }

    // for filtering STEP 4
    const searched = keyword => c => c.name.toLowerCase().includes(keyword);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Sub Category create</h4>}

                    <div className="form-group">
                        <label htmlFor={'catForSub'} style={{fontWeight:'bold'}}>Select Parent Category</label>
                        <select
                            name="category"
                            id="catForSub"
                            className={'form-control'}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option>--Please Select--</option>
                            {categories.length > 0 && categories.map(c => {
                                return (
                                    <option
                                        key={c._id}
                                        value={c._id}
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

                    {/*for filtering STEP 3 and 4 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword}/>

                    {/*for filtering STEP 5*/}
                    {subs.filter(searched(keyword)).map(c => {
                        return (
                            <div
                                className={'alert alert-secondary'}
                                key={c._id}
                            >
                                {c.name}
                                <span onClick={() => handleRemove(c.slug)} className={'btn btn-sm float-right'}>
                                    <DeleteOutlined className={'text-danger'}/>
                                </span>
                                <Link to={`/admin/sub/${c.slug}`}>
                                    <span className={'btn btn-sm float-right'}>
                                    <EditOutlined className={'text-warning'}/>
                                </span>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default SubCreate;