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

class InfoNavbar extends React.Component {
    public render() {
        return (
            <div>
                <Navbar fixedToTop={true}>
                    <NavbarGroup align={Alignment.LEFT}>
                        <NavbarHeading>Todos</NavbarHeading>
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

export default InfoNavbar;
