import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import App from './App'
import 'App.less';
import { createBrowserHistory } from 'history'
import Login from 'pages/login/index'

const customHistory = createBrowserHistory()

const Root = () => {
  console.log(localStorage.getItem('token'))
  const token = localStorage.getItem('token')

  if (!token) {
    customHistory.replace('/login')
  }

  return (
    <div>
      <Router history={customHistory}>
        <Switch>
          {token ? <Route component={App} /> : <Route component={Login} />}
        </Switch>
      </Router>
    </div>
  )
}

export default Root



