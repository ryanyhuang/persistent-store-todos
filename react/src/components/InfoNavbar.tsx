import * as React from 'react';
import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
} from '@blueprintjs/core';
import { State } from '../reducers'
import { connect } from 'react-redux'

interface CompProps {
    boardId: string;
}
interface CompState {}

class InfoNavbar extends React.Component<CompProps, CompState> {
    public render() {
        const heading = `Todos (${this.props.boardId})`;
        return (
            <div>
                <Navbar fixedToTop={true}>
                    <NavbarGroup align={Alignment.LEFT}>
                        <NavbarHeading>{heading}</NavbarHeading>
                        <NavbarDivider />
                        <Button className={Classes.MINIMAL} icon="home" text="Home" />
                        <Button className={Classes.MINIMAL} icon="document" text="Files" />
                    </NavbarGroup>
                </Navbar>
                
                <div>{this.props.children}</div>
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    boardId: state.boardInfo.boardId,
});

export default connect<any, any, any>(mapStateToProps)(InfoNavbar);
