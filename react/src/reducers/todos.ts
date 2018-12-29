import Todo from '../models/Todo';
import { ActionTypes, Action } from '../actions/todos';
import {
    arrayMove,
} from 'react-sortable-hoc';

// Define our State interface for the current reducer
export interface State {
  todos: Todo[];
}

// Define our initialState
export const initialState: State = {
    todos: [
        {
            id: '10',
            name: 'task1',
            done: false,
        },
        {
            id: '11',
            name: 'task2',
            done: true,
        },
        {
            id: '12',
            name: 'task3',
            done: false,
        },
        {
            id: '13',
            name: 'task4',
            done: true,
        },
        {
            id: '14',
            name: 'task5',
            done: false,
        },
        {
            id: '15',
            name: 'task6',
            done: true,
        },
    ] // We don't have any todos at the start of the app
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.ADD_TODO: {
        const todo = action.payload.todo;

        return {
            ...state,
            todos: [todo, ...state.todos] // Add todo to todos array
        };
    }

    case ActionTypes.TOGGLE_TODO: {
        const { todoId } = action.payload;
        const toToggle = state.todos.find((todo) => todo.id === todoId);
        if (toToggle === undefined) {
            return state;
        }
        const toggled = { ...toToggle, done: !toToggle.done };
        return {
            ...state,
            todos: [toggled, ...state.todos.filter((todo) => todo.id !== todoId)],
        };
    }

    case ActionTypes.CHANGE_TODOS_ORDER: {
        const { oldIndex, newIndex } = action.payload;
        return {
            ...state,
            todos: arrayMove(state.todos, oldIndex, newIndex),
        };
    }

    default:
        return state;
    }
}