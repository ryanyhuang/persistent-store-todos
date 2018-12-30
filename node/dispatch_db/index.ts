import { State, reducer } from '../../react/src/reducers'
import { Action } from '../../react/src/actions/todos'

export const getStateFromDB = (key: string): State => {
	console.log(key);
	return null;
};

export const setStateToDB = (key: string, state: State) => {
	console.log(key);
};

export const dispatchActionToDB = (key: string, action: Action) => {
	// get state from db
	// make redux store w state
	// dispatch action
	// get state from store
	// set state to db
}