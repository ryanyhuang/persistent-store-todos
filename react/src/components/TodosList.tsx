import * as React from 'react'
import Todo from '../models/Todo'
import {
    Button,
    Card,
    EditableText,
    H1,
    Intent,
} from '@blueprintjs/core';
import SortableTodosList from './SortableTodosList';
import { SortableHandle } from 'react-sortable-hoc';

interface Props {
  todos: Todo[],
  onTodoClicked: (todoId: string) => void
}
interface State { }

export default class TodosList extends React.Component<Props, State> {
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
        const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want
        if(!todo.done) {
            return (
                <Card key={todo.id} style={{ margin: 5 }}>
                    <DragHandle/>
                    <Button onClick={() => onTodoClicked(todo.id)}>Done</Button>
                    <H1>{todo.name}</H1>
                    <EditableText
                        intent={Intent.NONE}
                        maxLength={20}
                        placeholder="Edit description...           "
                        selectAllOnFocus={true}
                    />
                </Card>
            );
        }
        return null;
    }
}