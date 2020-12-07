import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Tabs from './tabs';
import Login from '../pages/login';
import Landing from '../pages/Landing';
import EditLink from '../pages/editLink';
import LinkProfile from '../pages/linkProfile';
import Registration from '../pages/registration'
import ProfileEditing from '../pages/profileEditing';
import AnotherProfile from '../pages/anotherProfile';

const { Navigator, Screen } = createStackNavigator();

function AppStack(props) {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }} initialRouteName={props.initial}>
                <Screen name="Landing" component={Landing} />
                <Screen name="Login" component={Login} />
                <Screen name="Registration" component={Registration} />
                <Screen name="LinkProfile" component={LinkProfile} />
                <Screen name="Tabs" component={Tabs} />
                <Screen name="EditLink" component={EditLink} />
                <Screen name="ProfileEditing" component={ProfileEditing} />
                <Screen name="AnotherProfile" component={AnotherProfile} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;