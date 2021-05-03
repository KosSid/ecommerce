import React from 'react';
import {useHistory} from 'react-router-dom';
import {useState, useEffect} from 'react'

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    let history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(curCount => --curCount);
        }, 1000);
        // redirect when count = 0
        count === 0 && history.push('/');
        // cleanup interval
        return () => clearInterval(interval);
    }, [count, history])

    return (
        <div className={'container p5 text-center'}>
            <p>Redirecting you in {count} seconds</p>
        </div>
    );
}

export default LoadingToRedirect;