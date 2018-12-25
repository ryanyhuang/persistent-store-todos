import * as React from 'react'
import {
    Card,
    EditableText,
    H1,
    Intent,
} from '@blueprintjs/core';

interface Props {
    handleSubmit: (value: string) => void
}
interface State {
    value: string
}

export default class AddTodoForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { value: '' }; // Value is empty by default
    }

    _updateValue = (value: string) => {
        this.setState({ value })
    }

    _handleSubmit = (value: string) => {
        if (!this.state.value.trim()) {
            return;
        }

        this.props.handleSubmit(this.state.value);
        this.setState({ value: '' });
    }

    render() {
        const { value } = this.state
        const { _updateValue, _handleSubmit } = this
        return (
            <Card style={{margin: 5}}>
                <H1>
                    <EditableText
                        intent={Intent.NONE}
                        maxLength={20}
                        placeholder="New task...           "
                        selectAllOnFocus={true}
                        confirmOnEnterKey={true}
                        value={value}
                        onChange={input => _updateValue(input)}
                        onConfirm={_handleSubmit}
                    />
                </H1>
                
            </Card>
        );
    }
}