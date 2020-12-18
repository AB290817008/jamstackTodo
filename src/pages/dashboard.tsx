import React from "react"
import PageLayout from "../pageLayout/pageLayout"
import { Router } from "@reach/router"
import UserArea from "../components/userArea"

export default function Dashboard() {
  return (
    <PageLayout>
      <Router>
        <UserArea path="/dashboard" />
      </Router>
    </PageLayout>
  )
}
