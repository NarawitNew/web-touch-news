import { Route, Switch } from "react-router-dom";

import { Context } from "context";
import CreateNews from "pages/admin/news/index";
import HomeAdmin from "pages/admin/home/index";
import HomeSuper from "pages/super/home/index";
import Manage from "pages/super/manage/index";
import NotFound from "pages/notFound/index";
import Profile from "pages/profile/index";
import React from "react";
import ViewNews from "pages/viewNews/index";
import { useContext } from "react";

export default function Routers() {
  const context = useContext(Context);
  const role = context.user.role;
  return (
    <>
      {role === "superadmin" ? (
        <Switch>
          <Route exact component={HomeSuper} path="/"></Route>
          <Route component={ViewNews} path="/home/view/:id"></Route>
          <Route component={HomeSuper} path="/home"></Route>
          <Route component={Profile} path="/:state/profile/:id"></Route>
          <Route component={Manage} path="/manage"></Route>
          <Route component={Profile} path="/profile"></Route>
          <Route component={NotFound} />
        </Switch>
      ) : (
        <Switch>
          <Route exact component={HomeAdmin} path="/"></Route>
          <Route component={ViewNews} path="/home/view/:id"></Route>
          <Route component={CreateNews} path="/home/:type/:id"></Route>
          <Route component={CreateNews} path="/home/:type"></Route>
          <Route component={HomeAdmin} path="/home"></Route>
          <Route component={Profile} path="/profile"></Route>
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}
