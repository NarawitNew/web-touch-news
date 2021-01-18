import { Route, Switch } from "react-router-dom"

import Home from 'constants/home/index'
import Manage from 'constants/manage/index'
import Profile from 'constants/profile/index'
import React from 'react'
import ViewNews from 'constants/viewNews/index'

export default function Routers() {
    return (
        <Switch>
            <Route exact component={Home} path="/"></Route>
            <Route exact path="/home/view"><ViewNews /></Route>
            <Route exact component={Home} path="/home"></Route>
            <Route path="/:state/profile/:id" component={Profile}></Route>
            <Route component={Manage} path="/manage"></Route>
            <Route component={Profile} path="/profile/:id"></Route>
            <Profile type='' title='โปรไฟล์'></Profile>
            {/* <Profile type='manage' title='ผู้ดูแลระบบ'></Profile> */}
        </Switch>
    );
}