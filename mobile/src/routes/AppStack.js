import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Landing from '../pages/Landing';
import Login from '../pages/login';
//import GiveClasses from '../pages/GiveClasses';
import Tabs from './tabs';

const { Navigator, Screen } = createStackNavigator();

function AppStack() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Landing" component={Landing} />
                <Screen name="Login" component={Login} />
                <Screen name="Tabs" component={Tabs} />
            </Navigator>
        </NavigationContainer>
    );
}

export default AppStack;