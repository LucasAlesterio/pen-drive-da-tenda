import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Landing from '../pages/Landing';
import Login from '../pages/login';
import Registration from '../pages/registration'
import Tabs from './tabs';

const { Navigator, Screen } = createStackNavigator();

function AppStack(props) {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }} initialRouteName={props.initial}>
                <Screen name="Landing" component={Landing} />
                <Screen name="Login" component={Login} />
                <Screen name="Registration" component={Registration} />
                <Screen name="Tabs" component={Tabs} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;