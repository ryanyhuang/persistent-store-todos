import { ActionTypes, Action } from '../actions/todos';

// Define our State interface for the current reducer
export interface State {
    boardId: string;
}

// Define our initialState
export const initialState: State = {
    boardId: "no id",
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    default:
        return state;
    }
}