import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Landing from './pages/landing/landing';
import TimeLine from './pages/timeLine/index';
import Search from './pages/search/index';
import LinkProfile from './pages/linkProfile/index';
import AddLink from './pages/addLink/index';
import EditLink from './pages/editLink/index';
import Profile from './pages/profile/index';
import Friends from './pages/friends/index';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={TimeLine}/>
                <Route path="/landing" component={Landing}/>
                <Route path="/search" component={Search}/>
                <Route path="/linkProfile/:id" component={LinkProfile}/>
                <Route path="/editLink/:id" component={EditLink}/>
                <Route path="/addLink" component={AddLink}/>
                <Route path="/profile/:user" component={Profile}/>
                <Route path="/friends" component={Friends}/>
            </Switch>
        </BrowserRouter>
    );
}