import * as React from 'react'
import Todo from '../models/Todo'
import {
    Button,
    Card,
    H1,
} from '@blueprintjs/core';
import SortableTodosList from './SortableTodosList';

interface Props {
    todos: Todo[],
    onTodoClicked: (todoId: string) => void,
}
interface State {}

export default class DoneTodosList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { todos } = this.props;

        return (
            <SortableTodosList todos={todos} getCardInner={this.getCardInner}/>
        );
    }

    getCardInner = (todo: Todo) => {
        const { onTodoClicked } = this.props;
        if(todo.done) {
            return (
                <Card style={{ margin: 5 }}>
                    <Button onClick={() => onTodoClicked(todo.id)}>Not Done</Button>
                    <H1 style={{ textDecoration: 'line-through'}}>{todo.name}</H1>
                    {String(todo.done)}
                </Card>
            );
        }
        return null;
    }
}