import * as React from 'react'
import Todo from '../models/Todo'
import {
    SortableContainer,
    SortableElement,
} from 'react-sortable-hoc';
import { connect } from 'react-redux'
import { changeTodosOrder } from '../actions/todos'

interface Props {
    todos: Todo[],
    getCardInner: (todo: Todo) => JSX.Element | null,
    onSortEnd: (oldIndex: number, newIndex: number) => void,
}
interface State {}

/*
 * Wrapper for react-sortable-hoc that applies specifically to todos
 */
class SortableTodosList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { todos } = this.props;

        const SortableItem = SortableElement<{todo: Todo}>(({todo}) => {
            return (
                <div>
                    {this.props.getCardInner(todo)}
                </div>
            );
        });

        const SortableList = SortableContainer<{items: Todo[]}>(({items}) => {
            return (
                <div>
                    {items.map((todo: Todo, index: number) => (
                        <SortableItem key={`item-${index}`} index={index} todo={todo} />
                    ))}
                </div>
            );
        });

        return (
            <SortableList items={todos} onSortEnd={this.onSortEnd} useDragHandle={true} />
        );
    }

    onSortEnd = ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
        this.props.onSortEnd(oldIndex, newIndex);
    };
}

const mapDispatchToProps = {
    onSortEnd: changeTodosOrder,
}

export default connect<any, any, any>(null, mapDispatchToProps)(SortableTodosList)
