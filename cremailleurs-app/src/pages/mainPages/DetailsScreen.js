import { Text, View, Alert, Image, FlatList, Dimensions, ScrollView, Pressable } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const DetailsContainer = ({ route, navigation }) => {

    const win = Dimensions.get('window');
    const myCard = route.params.card;
    const tabImgs = myCard.images;

    const alertContact = () =>
      Alert.alert(
        "Qui contacter ?",
        myCard.contact.agency,
        [
          { text: "OK" }
        ]
      );

    return (
        <ScrollView>

            <FlatList
                data={tabImgs}
                style={tw.style('w-full h-2/4')}
                renderItem={ ({ item }) => {
                    return <Image source={{ uri: item }} style={{ width: win.width, height: win.height/2, }} ></Image>; }}
                pagingEnabled
                horizontal
                //showsHorizontalScrollIndicator={false}
            />

            <View style={tw.style('mx-2 my-5 bg-white p-4 rounded-xl ')}>
                <Text style={tw.style('text-left font-bold text-2xl text-blue-900')} >A Propos</Text>
                <Text style={tw.style('text-center font-light text-justify my-4')}>{myCard.description}</Text>
                <View style={tw.style('flex flex-row ')} >
                    <View style={tw.style('flex-1')} >
                        <Text style={tw.style('text-center text-xl text-slate-600')} >
                            <Ionicons name={"compass"} style={tw.style('text-xl text-rose-700')}  />
                            &nbsp; Localisation
                        </Text>
                        <Text style={tw.style('text-center font-bold text-lg text-blue-900')} >{myCard.city}</Text>
                    </View>

                    <View style={tw.style('flex-1')} >

                        <Text style={tw.style('text-center text-xl text-slate-600')} >
                            <Ionicons name={"expand"} style={tw.style('text-xl text-rose-700')}  />
                             &nbsp; Surface
                         </Text>
                        <Text style={tw.style('text-center font-bold text-lg text-blue-900')}>{myCard.surface}m2 · {myCard.rooms} Pièces</Text>
                    </View>

                </View>

                <View style={tw.style('mt-8')} >
                    <Text style={tw.style('text-center text-xl text-slate-600')} >
                        <Ionicons name={"logo-euro"} style={tw.style('text-xl text-rose-700')}  />
                     &nbsp;Prix</Text>
                    <Text style={tw.style('text-center font-bold text-lg text-blue-900')}>{myCard.price} {myCard.leasing ? '/ mois ' : ''}</Text>
                </View>

                <Pressable style={tw.style('w-3/5 py-3 left-18 bg-rose-700 rounded-xl mt-12 mb-4')} onPress={alertContact}>
                    <Text style={tw.style('text-center text-white font-bold text-lg uppercase')}>Contacter</Text>
                </Pressable>

            </View>
        </ScrollView>
    )
}

/*const Stack = createStackNavigator();

const DetailsPageScreen = () => (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="ResearchC" component={ResearchContainer} />
      <Stack.Screen options={{headerRight: ()=>null, headerShown: false}} name="DetailS" component={DetailsContainer} />
    </Stack.Navigator>
);*/

export default DetailsContainer;
