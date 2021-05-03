import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'; // for devtools setup
import rootReducer from "./redux/reducers";

const store = createStore(rootReducer, composeWithDevTools());

const app = (
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

