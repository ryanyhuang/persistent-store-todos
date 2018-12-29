import * as React from 'react';
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
// import store from './store'
import axios from 'axios'
import './index.css'
import logger from 'redux-logger'
import { createStore, Action, applyMiddleware, Middleware } from 'redux'
import { State, reducer } from './reducers'
import App from './components/App'
import Cookies from 'js-cookie'
import * as Uuid from 'uuid'

declare global {
    interface Window {
        __PRELOADED_STATE__: State;
    }
}

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const boardId = preloadedState.boardInfo.boardId;
Cookies.set('boardId', boardId);

const posterMiddleware: Middleware = store => next =>  <A extends Action>(action: A): A => {
    axios.post('/db_dispatch', action)
        .then(res => {
            console.log(res.data);
        });
    return next(action);
}

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */
const store = createStore<State>(
    reducer,
    preloadedState,
    applyMiddleware(logger, posterMiddleware),
);

// Create Redux store with initial state
ReactDOM.hydrate(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)

// ReactDOM.render(
//     <Provider store={store}>
//         <App />
//     </Provider>,
//     document.getElementById('root') as HTMLElement
// );

registerServiceWorker()
