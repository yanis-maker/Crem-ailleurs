import { ImageBackground, StyleSheet, Text, View, Alert, StatusBar } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FeedContainer from './FeedScreen';
import ResearchContainer from './ResearchScreen';
import DetailsContainer from './DetailsScreen';
import tw from 'twrnc';

const Tab = createBottomTabNavigator();

export const FullScreen = () => {

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Feed') {
                    iconName = 'home-outline';
                } else if (route.name === 'Explore') {
                    iconName = 'compass-outline';
                }

              return <Ionicons name={iconName} size={size} color={color} />; 
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarShowLabel: false,
            headerShown: false,})}
            //tabBar={props => <BottomTabBar {...props} state={{...props.state, routes: props.state.routes.slice(0,2)}}></BottomTabBar>}
            >
            <Tab.Screen name="Feed" component={FeedContainer}/>
            <Tab.Screen name="Explore" component={ResearchContainer} initialParams={{data: []}}/>
            <Tab.Screen name="Detail" component={DetailsContainer} 
                        options={{tabBarButton: () => null, tabBarVisible: false,}}/>
        </Tab.Navigator>
    );
};
