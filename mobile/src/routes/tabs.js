import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather} from '@expo/vector-icons';
import TimeLine from '../pages/timeLine';
import Friends from '../pages/friends';
import AddLink from '../pages/addLink';
import Search from '../pages/search';
import Profile from '../pages/profile';

const { Navigator, Screen } = createBottomTabNavigator();

export default function Tabs(){
    return (
        <Navigator
        tabBarOptions={{
        style: {
            elevation: 0,
            shadowOpacity: 0,
            height: 64,
            border:'none'
        },
        tabStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            border:'none'
        },
        iconStyle: {
            flex: 0,
            width: 20,
            height: 20,
        },
        inactiveBackgroundColor: '#0A0A0A',
        activeBackgroundColor: '#0A0A0A',
        inactiveTintColor: '#C2C2C2',
        activeTintColor: '#FFEB0A'
        }}
    >
        <Screen 
        name="TimeLine" 
        component={TimeLine}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="home" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Friends" 
        component={Friends}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="users" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />
        
        <Screen 
        name="AddLink" 
        component={AddLink}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="file-plus" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Search" 
        component={Search}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="search" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />

        <Screen 
        name="Profile" 
        component={Profile}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => {
            return (
                <Feather name="user" size={size} color={focused ? '#FFEB0A' : color} />
            );
            }
        }}
        />
    </Navigator>
    );
}

/*
import { Feather } from '@expo/vector-icons'; 
<Feather name="instagram" size={24} color="C2C2C2" />

**Feather**
instagram
facebook
twitter
home
user-plus
user-check
user
users
edit
log-out
file-plus
search
plus-circle
x
plus
camera
copy
mail
at-sign
key

**AntDesign**
heart (preenchido)
hearto (vazio)
link
left (botão de voltar)

**FontAwesome**
star
star-o
star-half-o
*/