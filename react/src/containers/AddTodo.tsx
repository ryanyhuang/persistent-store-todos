import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Action } from '../actions/todos'
import { addTodo } from '../actions/todos'
import AddTodoForm from '../components/AddTodoForm'

// Cleaner, less obvious way to wrap actions with dispatch
// const mapDispatchToProps = {
//     handleSubmit: addTodo
// }

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    handleSubmit: (message: string) => dispatch(addTodo(message)),
})

export default connect<any, any, any>(null, mapDispatchToProps)(AddTodoForm)