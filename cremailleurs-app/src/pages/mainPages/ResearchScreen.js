import { ImageBackground, StyleSheet, Text, View, Alert, Image, ScrollView, Pressable } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';

const image = require('../../../assets/sad-dog.png');

const ResearchContainer = ({ route, navigation }) => {

    const [iId, setIId] = useState(0);

    const fetchData = () => {
        let apiMyCard = `http://toms34.fr:49152/id?id=${iId}&origin=paru_vendu_index`;

        fetch(apiMyCard)
        .then(response => response.json())
        .then(card => navigation.navigate('Detail', {card}));
    }

    if(route.params.data.length == 0){
        return (
            <View>
                <Text style={tw.style('text-center font-normal text-xl absolute top-32 left-4')}>Désolé, il n'y pas de résultat pour votre recherche</Text>
                <Image
                    style={tw.style('w-1/2 h-1/2 top-60 left-28')}
                    source={image}
                />
            </View>

        )
    }else{

        return (
            <ScrollView style={tw.style('my-6')}>
                    {
                        route.params.data.map((item) => {
                            return (
                                <Pressable onPressIn={() => {setIId(item.id)}} onPress={() => {fetchData()}}>
                                    <View key={item.id} style={tw.style('bg-white rounded-xl mx-8 my-4 border-slate-200 h-42 relative')}>
                                        <Image
                                            style={[tw.style('w-1/2 h-full'), styles.BorderImg]}
                                            source={{ uri: item.images[0] }}
                                        />
                                        <View style={tw.style('absolute top-8 right-8')} >
                                            <Text style={tw.style('text-base text-right text-slate-700')} >{item.city}</Text>
                                            <Text style={tw.style('text-base text-right text-slate-700')} >{item.price} €</Text>
                                            <Text style={tw.style('text-base text-right text-slate-700')} >{item.rooms} Pièces</Text>
                                        </View>
                                    </View>
                                </Pressable>

                            );
                        })
                    }
                </ScrollView>
            )

    }

}

/*const Stack = createStackNavigator();

const ResearchesPageScreen = ({route}) => (
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="ResearchC" component={ResearchContainer} />
      <Stack.Screen options={{headerRight: ()=>null, headerShown: false}} name="DetailS" component={DetailsContainer} />
    </Stack.Navigator>
);*/

export default ResearchContainer;

const styles = StyleSheet.create({
BorderImg: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12
}
});
