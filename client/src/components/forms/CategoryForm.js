import React from 'react';

const CategoryForm = ({handleSubmit, name, setName}) => {
    return (
        <form onSubmit={handleSubmit} >
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id={'name'}
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(prev => e.target.value)}
                    autoFocus
                    required
                />
                <br/>
                <button className="btn btn-outline-primary">Save</button>
            </div>
        </form>
    );
}

export default CategoryForm;