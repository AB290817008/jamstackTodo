import React, { useEffect, useState } from "react"
import * as netlifyIdentity from "netlify-identity-widget"

interface initialVal {
  identity: any
  user: netlifyIdentity.User
}

export const identityContext = React.createContext<initialVal>({
  identity: null,
  user: null,
})

const IdentityProvider = props => {
  const [user, setUser] = useState<netlifyIdentity.User | null>(null)

  useEffect(() => {
    netlifyIdentity.init({})
  }, [])

  netlifyIdentity.on("login", user => {
    netlifyIdentity.close()
    setUser(user)
  })

  netlifyIdentity.on("logout", () => {
    netlifyIdentity.close()
    setUser(null)
  })

  return (
    <identityContext.Provider value={{ identity: netlifyIdentity, user: user }}>
      {props.children}
    </identityContext.Provider>
  )
}

export default IdentityProvider
