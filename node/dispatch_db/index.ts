import { State, reducer } from '../../react/src/reducers'
import { Action } from '../../react/src/actions/todos'
import * as mysql from 'promise-mysql'
import { createStore } from 'redux'
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env' });
}

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'todos',
	connectionLimit: 10,
});

export const getStateFromDB = async (key: string): Promise<State> => {
	return await pool.query(`SELECT * FROM dispatch_db WHERE id = '${key}'`)
		.then((resp) => {
			if(resp.length === 0) {
				return null;
			}
			return JSON.parse(resp[0].store);
		});
};

export const setStateToDB = async (key: string, state: State) => {
	return await pool.query(`
		INSERT INTO dispatch_db
		(id, store)
		VALUES('${key}', '${JSON.stringify(state)}')
	`);
};

export const dispatchActionToDB = async (key: string, action: Action) => {
	// get state from db
	const currState = await getStateFromDB(key);
	// make redux store w state
	const beStore = createStore(reducer, currState);
	beStore.subscribe(async () => {
		// When state will be updated(in this case, when items will be fetched), this is how we can get updated state.                    
		const nextState = beStore.getState();
		// update state to db
		return await pool.query(`
			UPDATE dispatch_db
			SET store = '${JSON.stringify(nextState)}'
			WHERE id = '${key}'
		`);
	});

	beStore.dispatch(action);
}

// update dispatch_db set store = '{"key1": "value3", "key2": "value2"}' where id = '123';

// INSERT INTO dispatch_db (id, store) VALUES('123', '{"key1": "value3", "key2": "value2"}');

// CREATE TABLE IF NOT EXISTS `dispatch_db` (`id` varchar(255) NOT NULL, `store` JSON NOT NULL, PRIMARY KEY (`id`))