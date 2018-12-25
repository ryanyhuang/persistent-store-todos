import logger from 'redux-logger'
import { createStore, Action, applyMiddleware, Middleware } from 'redux'
import { State, reducer, initialState } from '../reducers'
import axios from 'axios'

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
    initialState,
    // applyMiddleware(logger),
    applyMiddleware(logger, posterMiddleware),
);

export default store;