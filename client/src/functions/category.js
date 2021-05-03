import axios from 'axios';

// Get Gategories data

export const getCategories = async () => await axios.get(`${process.env.REACT_APP_API}/categories`);
export const getCategory = async (slug) => await axios.get(`${process.env.REACT_APP_API}/category/${slug}`);

// Delete category
export const removeCategory = async (slug, authtoken) => await axios.delete(
    `${process.env.REACT_APP_API}/category/${slug}`,
    {
        headers: {
            authtoken
        }
    }
)

// Update category
export const updateCategory = async (slug, category, authtoken) => await axios.put(
    `${process.env.REACT_APP_API}/category/${slug}`, category,
    {
        headers: {
            authtoken
        }
    }
)

// Add category
export const createCategory = async (category, authtoken) => await axios.post(
    `${process.env.REACT_APP_API}/category`, category,{
        headers: {
            authtoken
        }
    }
)

// Get Sub category
export const getCategorySubs = async (_id) =>
    await axios.get(`${process.env.REACT_APP_API}/category/subs/${_id}`);



