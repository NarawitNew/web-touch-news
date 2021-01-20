import { Route, Switch } from "react-router-dom"

import HomeAdmin from 'constants/admin/home/index'
import HomeSuper from 'constants/home/index'
import Manage from 'constants/manage/index'
import Profile from 'constants/profile/index'
import React from 'react'
import ViewNews from 'constants/viewNews/index'

export default function Routers(props) {
    return (
        <>
            {props.type === 'super' ?
                <Switch>
                    <Route exact component={HomeSuper} path="/"></Route>
                    <Route component={ViewNews} path="/home/view"></Route>
                    <Route component={HomeSuper} path="/home"></Route>
                    <Route component={Profile} path="/:state/profile/:id" ></Route>
                    <Route component={Manage} path="/manage"></Route>
                    <Route component={Profile} path="/profile/:id"></Route>
                    {/* <Profile type='' title='โปรไฟล์'></Profile> */}
                    {/* <Profile type='manage' title='ผู้ดูแลระบบ'></Profile> */}
                </Switch>
                :
                <Switch>
                    <Route exact component={HomeAdmin} path="/"></Route>
                    <Route component={ViewNews} path="/home/view"></Route>
                    <Route component={HomeAdmin} path="/home"></Route>
                    <Route component={Profile} path="/:state/profile/:id" ></Route>
                    <Route component={Manage} path="/manage"></Route>
                    <Route component={Profile} path="/profile/:id"></Route>
                    <Profile type='' title='โปรไฟล์'></Profile>
                    {/* <Profile type='manage' title='ผู้ดูแลระบบ'></Profile> */}
                </Switch>
            }
        </>
    );
}