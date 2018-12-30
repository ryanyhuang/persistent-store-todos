import * as React from 'react'
import Todo from '../models/Todo'
import {
    Button,
    Card,
    Intent,
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
                    <Button
                        style={{float: 'right'}}
                        icon="arrow-left"
                        onClick={() => onTodoClicked(todo.id)}
                        intent={Intent.DANGER}
                    />
                    <div>
                        <b style={{
                            textDecoration: 'line-through',
                            fontSize: 20,
                        }}>
                            {todo.name}
                        </b>
                    </div>
                </Card>
            );
        }
        return null;
    }
}