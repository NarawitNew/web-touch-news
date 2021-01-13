import React from 'react'
import { Switch, Route } from "react-router-dom"
import Home from 'constants/home/index'
import Manage from 'constants/manage/index'
import Profile from 'constants/profile/index'
import ViewNews from 'constants/viewNews/index'

export default function Routers() {
    return (
        <Switch>
            <Route exact component={Home} path="/"></Route>
            <Route exact path="/home/view"><ViewNews /></Route>
            <Route exact component={Home} path="/home"></Route>
            <Route path="/manage/profile"><Profile type='manage' title='ผู้ดูแลระบบ'></Profile></Route>
            <Route component={Manage} path="/manage"></Route>
            <Route component={Profile} path="/profile"><Profile type='' title='โปรไฟล์'></Profile></Route>
        </Switch>
    );
}