import 'App.less';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import App from './App'
import Login from 'pages/login/index'
import React from 'react'
import { createBrowserHistory } from 'history'

const customHistory = createBrowserHistory()

const Root = () => {
  // console.log(localStorage.getItem('token'))
  const token = localStorage.getItem('access_token')

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



