import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Landing from './pages/landing/landing';
import TimeLine from './pages/timeLine/index';
import Search from './pages/search/index';
import LinkProfile from './pages/linkProfile/index';
import AddLink from './pages/addLink/index';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={TimeLine}/>
                <Route path="/landing" component={Landing}/>
                <Route path="/search" component={Search}/>
                <Route path="/linkProfile" component={LinkProfile}/>
                <Route path="/addLink" component={AddLink}/>
            </Switch>
        </BrowserRouter>
    );
}