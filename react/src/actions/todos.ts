import Todo from '../models/Todo'
import * as Uuid from 'uuid'

/*
 * We're defining every action name constant here
 * We're using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
    ADD_TODO = 'ADD_TODO',
    TOGGLE_TODO = 'TOGGLE_TODO',
    CHANGE_TODOS_ORDER = 'CHANGE_TODOS_ORDER',
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
type AddTodoActionPayload = {
    todo: Todo;
};
export interface AddTodoAction {
    type: ActionTypes.ADD_TODO,
    payload: AddTodoActionPayload,
};

type ToggleTodoActionPayload = {
    todoId: string
};
export interface ToggleTodoAction {
    type: ActionTypes.TOGGLE_TODO,
    payload: ToggleTodoActionPayload,
};

type ChangeTodosOrderActionPayload = {
    oldIndex: number,
    newIndex: number,
};
export interface ChangeTodosOrderAction {
    type: ActionTypes.CHANGE_TODOS_ORDER,
    payload: ChangeTodosOrderActionPayload,
};

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function addTodo(name: string): AddTodoAction {
    return {
        type: ActionTypes.ADD_TODO,
        payload: {
            todo: {
                id: Uuid.v1(),
                name: name,
                done: false
            }
        }
    };
}

export function toggleTodo(todoId: string): ToggleTodoAction {
    return {
        type: ActionTypes.TOGGLE_TODO,
        payload: { todoId },
    };
}

export function changeTodosOrder(oldIndex: number, newIndex: number): ChangeTodosOrderAction {
    return {
        type: ActionTypes.CHANGE_TODOS_ORDER,
        payload: {oldIndex, newIndex},
    };
}

/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = AddTodoAction | ToggleTodoAction | ChangeTodosOrderAction