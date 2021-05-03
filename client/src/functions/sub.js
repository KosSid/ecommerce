import axios from 'axios';

// Get Sub Gategories data

export const getSubs = async () => await axios.get(`${process.env.REACT_APP_API}/subs`);
export const getSub = async (slug) => await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`);

// Delete Sub category
export const removeSub = async (slug, authtoken) => await axios.delete(
    `${process.env.REACT_APP_API}/sub/${slug}`,
    {
        headers: {
            authtoken
        }
    }
)

// Update Sub category
export const updateSub = async (slug, sub, authtoken) => await axios.put(
    `${process.env.REACT_APP_API}/sub/${slug}`, sub,
    {
        headers: {
            authtoken
        }
    }
)

// Add Sub category
export const createSub = async (sub, authtoken) => await axios.post(
    `${process.env.REACT_APP_API}/sub`, sub,{
        headers: {
            authtoken
        }
    }
)
