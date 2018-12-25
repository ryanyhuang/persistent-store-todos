import * as React from 'react'
import AddTodo from '../containers/AddTodo'
import Todos from '../containers/Todos'
import DoneTodos from '../containers/DoneTodos'
import InfoNavbar from '../components/InfoNavbar'
import SplitPane from 'react-split-pane'

class App extends React.Component {
    render() {
        return (
            <div>
                <InfoNavbar>
                    <SplitPane defaultSize="50%">
                        <div>
                            <AddTodo />
                            <Todos />
                        </div>
                        <div>
                            <DoneTodos />
                        </div>
                    </SplitPane>
                    
                </InfoNavbar>
            </div>
        );
    }
}

export default App;
