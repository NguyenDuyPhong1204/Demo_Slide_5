import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import App from "../App";
import { Home } from "./Home";

export function Main(){
    const Stack = createNativeStackNavigator();
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name ="Main" component={App}/>
                <Stack.Screen name="Home" component={Home}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}