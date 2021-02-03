import { Route, Switch } from "react-router-dom"

import CreateNews from 'pages/admin/createNews/index'
import HomeAdmin from 'pages/admin/home/index'
import HomeSuper from 'pages/super/home/index'
import Manage from 'pages/super/manage/index'
import Profile from 'pages/profile/index'
import React from 'react'
import ViewNews from 'pages/viewNews/index'

export default function Routers(props) {
    return (
        <>
            {props.type === 'Superadmin' ?
                <Switch>
                    <Route exact component={HomeSuper} path="/"></Route>
                    <Route component={ViewNews} path="/home/view"></Route>
                    <Route component={HomeSuper} path="/home"></Route>
                    <Route component={Profile} path="/:state/profile/:id" ></Route>
                    <Route component={Manage} path="/manage"></Route>
                    <Route component={Profile} path="/profile"></Route>
                    {/* <Profile type='' title='โปรไฟล์'></Profile> */}
                    {/* <Profile type='manage' title='ผู้ดูแลระบบ'></Profile> */}
                </Switch>
                :
                <Switch>
                    <Route exact component={HomeAdmin} path="/"></Route>
                    <Route component={CreateNews} path="/home/:type/:id"></Route>
                    <Route component={CreateNews} path="/home/:type"></Route>
                    <Route component={ViewNews} path="/home/view"></Route>
                    <Route component={HomeAdmin} path="/home"></Route>
                    {/* <Route component={Profile} path="/:state/profile/:id" ></Route> */}
                    <Route component={Manage} path="/manage"></Route>
                    <Route component={Profile} path="/profile"></Route>
                    <Profile type='' title='โปรไฟล์'></Profile>
                    {/* <Profile type='manage' title='ผู้ดูแลระบบ'></Profile> */}
                </Switch>
            }
        </>
    );
}