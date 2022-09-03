import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import tw from 'twrnc';
import { ScrollView } from 'react-native-gesture-handler';

const CityContainer = ({ navigation }) => {

    const textButtonWhite = tw.style('text-center text-lg text-white font-bold');
    const btnBlue = tw.style('w-38 py-3 bg-blue-900 rounded-xl left-25 top-4');
    const inputStyleWithoutSuggestion = tw.style('w-85 h-15 bg-white rounded-xl text-center border border-slate-200');
    const inputStyleWithSuggestion = tw.style('w-85 h-15 bg-white text-center rounded-t-xl border border-slate-200');

    const [city, setCity] = useState('');
    const [apiCity, setApiCity] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);

    useEffect(() => {
    const loadCities = async () => {const response = await axios.get('http://toms34.fr:49152/cities');
    setApiCity(response.data)}
    loadCities()
    }, []);

    const onClickSuggestion = (text) => {
        setCity(text);
        setFilteredCities([]);
    }
    const onChangeHandler = (text) => {
        let matches = []
        if (text.length > 0) {
            matches = apiCity.filter(city => {
                const regex = new RegExp(`${text}`, "gi");
                return city.match(regex)})
        }
        setFilteredCities(matches.slice(0,10));
        setCity(text);
    }

    return (

        <View style={styles.box}>
            <Text style={tw.style('text-3xl top-1/6 font-bold text-slate-800')}>Où souhaitez-vous faire votre recherche ?</Text>
            <View style={tw.style('top-1/4')}>
                    <TextInput style={filteredCities.length === 0 ? inputStyleWithoutSuggestion : inputStyleWithSuggestion }
                        onChangeText={(text) => (text) != '' ? onChangeHandler(text) : setCity('')}
                        value={city}
                        placeholder="ex : Montpellier"
                        clearTextOnFocus= {true}
                        //onEndEditing={filteredCities == [] ? () => navigation.navigate('FeedC', {cityResearched: city}) : null}
                    />
                    <ScrollView keyboardDismissMode='on-drag'
                                style={{ height: 180 }}>
                        {
                            filteredCities.map( (city, i) =>
                            <View key={i}
                                style={[tw.style('w-85 h-15 bg-white flex justify-center items-center'), styles.suggestionCss]}>
                                <Text onPress = { () => onClickSuggestion(city)}>{city}</Text>
                            </View>
                        )}
                    </ScrollView>
                    {
                        filteredCities.length === 0 && city ?
                        <Pressable style={btnBlue} onPress={() => navigation.navigate('FeedC', {cityResearched: city})}>
                            <Text style={textButtonWhite}>Valider</Text>
                        </Pressable> : null
                    }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
      flex: 1,
      marginHorizontal: 16,
  },
    suggestionCss: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#E2E8F0',
    }
});

export default CityContainer ;
