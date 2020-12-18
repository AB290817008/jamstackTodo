import React, { useContext, useRef, useState } from "react"
import Button from "react-bootstrap/Button"
import { RouteComponentProps } from "@reach/router"
import { identityContext } from "../context/authContext"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
import { useQuery, useMutation, gql } from "@apollo/client"
const styles = require("./userArea.module.css")
import Jumbotron from "react-bootstrap/Jumbotron"

const ADD_TODO = gql`
  mutation AddTodo($value: String!) {
    addTodo(value: $value) {
      id
    }
  }
`

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      value
      done
    }
  }
`

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodo($id: ID!) {
    updateTodoDone(id: $id) {
      value
      done
    }
  }
`

export default function UserArea(props: RouteComponentProps) {
  const [addTodo] = useMutation(ADD_TODO)
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE)
  let { loading, error, data, refetch } = useQuery(GET_TODOS,{fetchPolicy:"cache-first"})

  const { user, identity } = useContext(identityContext)
  const inputRef = useRef<any>()


  React.useEffect(()=>{
    async function fetchData(){
        await refetch();
    }

    fetchData()

  },[user])


  return (
  !!user ? (
    <Jumbotron className={styles.jumbotron}>
      <Button disabled = {loading}
        className={styles.logout}
        onClick={() => {
          identity.logout()
        }}
        variant="primary"
      >
        Logout
      </Button>

      <h2>{user.user_metadata.full_name}'s Notebook</h2>

      <div className={styles.inputContainer}>
        <Form.Control
          className={styles.input}
          ref={inputRef}
          type="text"
          placeholder="Add a new task"
        />
        <Button
          className={styles.addTaskButton}
          onClick={async () => {
            await addTodo({ variables: { value: inputRef.current.value } })
            console.log(inputRef.current.value)
            inputRef.current.value = ""
            await refetch()
          }}
        >
          Add Task
        </Button>
      </div>

      <ListGroup variant="flush">
        {(loading ) ? <div>Loading...</div> : 
        error ? <div>{error.message}</div> : 
          (data.todos.length === 0 ? (
            <h5>Your todo list is empty</h5>
          ) : (
            data.todos.map(todo => (
              <ListGroup.Item key={todo.id}>
                <div>
                  <Form.Check
                    defaultChecked={todo.done}
                    disabled={todo.done}
                    className={styles.checkBox}
                    type="checkbox"
                    onClick={async e => {
                      await updateTodoDone({ variables: { id: todo.id } })
                      await refetch()
                    }}
                  />
                  <p className={styles.todoText}>{todo.value}</p>
                </div>
              </ListGroup.Item>
            ))
          ))}
      </ListGroup>
    </Jumbotron>
  ) : (
    <div>
      <Jumbotron className={styles.jumbotron}>
        <h4>Please Login to view your dashboard</h4>
        <Button
          onClick={() => {
            identity.open()
          }}
          variant="primary"
        >
          Login
        </Button>
      </Jumbotron>
    </div>
  )
  )
}
