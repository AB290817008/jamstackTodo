import React, { useContext } from "react"
import PageLayout from "../pageLayout/pageLayout"
import Button from "react-bootstrap/Button"
import { identityContext } from "../context/authContext"
import Jumbotron from "react-bootstrap/Jumbotron"
const styles = require("./index.module.css")

export default function Home() {
  const { user, identity } = useContext(identityContext)

  return (
    <PageLayout>
      <Jumbotron className={styles.jumbotron}>
        <h2>Let us keep track of things for you!</h2>

        {!user ? (
          <Button
            onClick={() => {
              identity.open()
            }}
            variant="primary"
          >
            Login
          </Button>
        ) : (
          <Button
            onClick={() => {
              identity.logout()
            }}
            variant="primary"
          >
            Logout
          </Button>
        )}
        <ul>
          <li>Easy to use</li>
          <li>User friendly interface</li>
          <li>Cloud storage</li>
          <li>No hidden charges</li>
        </ul>
      </Jumbotron>
    </PageLayout>
  )
}
