import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import WelcomePageScreen from './src/pages/startPage/WelcomePage';
import tw from 'twrnc';

export default function App() {

  return (
    <NavigationContainer>{
      <View style={styles.page}>
          <StatusBar barStyle = "dark-content" hidden = {false} />
          <WelcomePageScreen />
      </View>
    }</NavigationContainer>
    );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
})
