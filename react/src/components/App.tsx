import * as React from 'react'
import AddTodo from '../containers/AddTodo'
import Todos from '../containers/Todos'
import DoneTodos from '../containers/DoneTodos'
import InfoNavbar from '../components/InfoNavbar'
import SplitPane from 'react-split-pane'

class App extends React.Component {
    render() {
        return (
            <InfoNavbar>
                {/* <SplitPane defaultSize="50%"> */}
                    <div className="box">
                        <div className="rowc" style={{
                                    backgroundColor: 'pink',
                                }}>
                            <AddTodo />
                            <Todos />
                        </div>
                        <div className="rowc" style={{
                                    backgroundColor: 'lightgreen',
                                }}>
                            <DoneTodos />
                        </div>
                    </div>
                {/* </SplitPane> */}
                
            </InfoNavbar>
        );
    }
}

export default App;
