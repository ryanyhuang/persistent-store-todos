import * as React from 'react'
import Todo from '../models/Todo'
import {
    Button,
    ButtonGroup,
    Card,
    EditableText,
    H1,
    Intent,
    Popover,
    Position,
} from '@blueprintjs/core';
import { DateTimePicker } from "@blueprintjs/datetime";
import SortableTodosList from './SortableTodosList';

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
        const datetime = (
            <DateTimePicker
                value={new Date()}
                timePickerProps={{ precision: "second", useAmPm: true }}
                onChange={(date: Date) => console.log(date)}
            />
        );
        if(!todo.done) {
            return (
                <Card key={todo.id} style={{ margin: 5 }}>
                    <span style={{float: 'right'}}>
                        <ButtonGroup minimal={true}>
                            <Popover content={datetime} position={Position.BOTTOM}>
                                <Button icon="calendar" />
                            </Popover>
                        </ButtonGroup>
                        <Button
                                icon="saved"
                                onClick={() => onTodoClicked(todo.id)}
                                intent={Intent.SUCCESS}
                            />
                    </span>
                    
                    <div>
                        <b style={{
                            fontSize: 20,
                        }}>
                            {todo.name}
                        </b>
                    </div>
                    <div>
                        <b style={{
                            fontSize: 20,
                            color: 'red',
                        }}>
                            due: {todo.dueDate === null ? "No date" : todo.dueDate.toLocaleString()}
                        </b>
                    </div>
                    <EditableText
                        intent={Intent.NONE}
                        maxLines={12}
                        minLines={3}
                        multiline={true}
                        placeholder="Add description..."
                        selectAllOnFocus={true}
                        confirmOnEnterKey={false}
                        // value={this.state.report}
                        // onChange={this.handleReportChange}
                    />
                </Card>
            );
        }
        return null;
    }
}