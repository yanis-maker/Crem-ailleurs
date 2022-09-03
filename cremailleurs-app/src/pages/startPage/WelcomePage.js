import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FullScreen } from '../mainPages/FullScreen';
import tw from 'twrnc';

const image = require('../../../assets/illustration.png');

const WelcomePage = () => {
  const nav = useNavigation();

  return (

    <View style={styles.box}>
      <ImageBackground source={image} resizeMode="cover" style={styles.box}>
        <Text style={tw.style('text-white text-4xl font-bold absolute top-16 left-17')} >Bienvenue sur Crem'Ailleurs !</Text>
        <Text style={tw.style('text-white text-center font-normal text-xl absolute top-46 left-8')}>La crème de la crème de l'immobilier.</Text>
        <Pressable style={tw.style('absolute bottom-16 w-3/5 py-3 left-18 bg-rose-700 rounded-xl')} onPress={() => nav.navigate('CremAilleursApp')}>
            <Text style={tw.style('text-center text-white font-bold text-lg uppercase')}>Commencer</Text>
        </Pressable>

      </ImageBackground>
    </View>
  );
}

const Stack = createStackNavigator();

const WelcomePageScreen = () => (
    <Stack.Navigator screenOptions={{gestureEnabled: false}}>
      <Stack.Screen options={{headerShown: false}} name="Return" component={WelcomePage} />
      <Stack.Screen options={{headerLeft: ()=>null, headerShown: false}} name="CremAilleursApp" component={FullScreen} />
    </Stack.Navigator>
);

const styles = StyleSheet.create({
    box: {
      flex: 1,
    }
});

export default WelcomePageScreen;
