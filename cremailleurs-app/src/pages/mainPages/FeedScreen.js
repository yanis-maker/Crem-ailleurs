import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import tw from 'twrnc';
import { useState } from 'react';
import CityContainer from './CityScreen';

const FeedContainer = ({ route, navigation }) => {
    const [house, setHouse] = useState(false);
    const [flat, setFlat] = useState(false);
    const [rent, setRent] = useState(false);
    const [buy, setBuy] = useState(false);
    const [minPrice, onChangeMinPrice] = useState(null);
    const [maxPrice, onChangeMaxPrice] = useState(null);
    const [minSurf, onChangeMinSurf] = useState(null);
    const [maxSurf, onChangeMaxSurf] = useState(null);


    const cityResearched = route.params.cityResearched;



    const fetchData = () => {
        let api = `http://toms34.fr:49152/search?city=${cityResearched}`;

        let type = undefined;
        let leasing = undefined;

        if((minPrice !== null)&&(minPrice !== "")){
            api += `&minprice=${minPrice}`;
        }
        if((maxPrice !== null)&&(maxPrice !== "")){
            api += `&maxprice=${maxPrice}`;
        }
        if((minSurf !== null)&&(minSurf !== "")){
            api += `&minsurface=${minSurf}`;
        }
        if((maxSurf !== null)&&(maxSurf !== "")){
            api += `&maxsurface=${maxSurf}`;
        }
        if(house && !flat){
            type=false;
        }
        if(!house && flat){
            type=true;
        }
        if(rent && !buy){
            leasing = true;
        }
        if(!rent && buy){
            leasing=false;
        }
        if(type !== undefined){
            api += `&type=${type}`;
        }
        if(leasing !== undefined){
            api += `&leasing=${leasing}`;
        }
        console.log(api);
        fetch(api)
        .then(response => response.json())
        .then(data => navigation.navigate('Explore', {data}));
    }



    const textButtonWhite = tw.style('text-center text-lg text-white font-bold');
    const textButtonBlack = tw.style('text-center text-lg text-black font-bold');
    const btnRose = tw.style('w-38 py-3 bg-rose-700 rounded-xl');
    const btnGray = tw.style('w-38 py-3 bg-gray-300 rounded-xl');
    const btnBlue = tw.style('w-38 py-3 bg-blue-900 rounded-xl left-25 top-4');
    const inputStyle = tw.style('w-38 h-12 bg-white rounded-xl text-center border border-slate-200');

    return (
        <View style={styles.box}>
            <TextInput  style={tw.style('text-base text-center top-8 text-slate-700')}
                        onPressIn={() => navigation.navigate('CityChoice')}
                        caretHidden={true}>
                <Ionicons size={20} name='location-outline' />{cityResearched}</TextInput>
            <Text style={tw.style('text-3xl top-1/8 font-bold text-slate-800')}>Quels biens voulez-vous voir ?</Text>

            <View style={tw.style('top-1/6')}>
                <View style={styles.buttons}>
                    <Pressable style={house ? btnRose : btnGray } onPress={() => {setHouse(!house)}}>
                        <Text style={house ? textButtonWhite : textButtonBlack}>Maison</Text>
                    </Pressable>
                    <Pressable style={flat ? btnRose : btnGray} onPress={() => {setFlat(!flat)}}>
                        <Text style={flat ? textButtonWhite : textButtonBlack}>Appartement</Text>
                    </Pressable>
                </View>
                {house || flat ?
                <View style={styles.buttons}>
                    <Pressable style={rent ? btnRose : btnGray} onPress={() => {setRent(!rent)}}>
                        <Text style={rent ? textButtonWhite : textButtonBlack}>Louer</Text>
                    </Pressable>
                    <Pressable style={buy ? btnRose : btnGray} onPress={() => {setBuy(!buy)}}>
                        <Text style={buy ? textButtonWhite : textButtonBlack}>Acheter</Text>
                    </Pressable>
                </View> : null}
                {rent || buy?
                <View>
                    <View style={styles.buttons}>
                        <TextInput style={inputStyle}
                                        onChangeText={onChangeMinPrice}
                                        value={minPrice}
                                        placeholder="min €"
                                        keyboardType="numeric"
                                        returnKeyType={ 'done' }
                        />
                        <TextInput style={inputStyle}
                                        onChangeText={onChangeMaxPrice}
                                        value={maxPrice}
                                        placeholder="max €"
                                        keyboardType="numeric"
                                        returnKeyType={ 'done' }
                        />
                    </View>
                    <View style={styles.buttons}>
                        <TextInput style={inputStyle}
                                            onChangeText={onChangeMinSurf}
                                            value={minSurf}
                                            placeholder="min m²"
                                            keyboardType="numeric"
                                            returnKeyType={ 'done' }
                        />
                        <TextInput style={inputStyle}
                                            onChangeText={onChangeMaxSurf}
                                            value={maxSurf}
                                            placeholder="max m²"
                                            keyboardType="numeric"
                                            returnKeyType={ 'done' }
                        />
                    </View>
                    <Pressable style={btnBlue} onPress={() => fetchData()}>
                        <Text style={textButtonWhite}>LET'S GO</Text>
                    </Pressable>
                </View> : null}
            </View>
        </View>
    )
}

const Stack = createStackNavigator();

const FeedPageScreen = () => (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="CityChoice" component={CityContainer} />
      <Stack.Screen options={{headerShown: false}} name="FeedC" component={FeedContainer} />
    </Stack.Navigator>
);

export default FeedPageScreen;

const styles = StyleSheet.create({
    box: {
      flex: 1,
      marginHorizontal: 16,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginVertical: 15,
    }
});
