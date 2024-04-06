import { Text, TouchableOpacity, View } from "react-native";
import App from "../App";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "react-native-google-signin";
export function Home({ route, navigation }: any) {
    const { user } = route.params;


    return (
        <View style={{ flex: 1 }}>
            <Text>Xin chào: {user?.email}</Text>
            <Text>Tên: {user?.name}</Text>
            <TouchableOpacity style={{ width: 250, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'orange' }}
                onPress={() => {
                    auth().signOut()
                        .then(() => {
                            navigation.navigate("Main")
                        })
                        .catch((error) => {
                            console.log(error);
                        })

                        GoogleSignin.signOut();
                }}>
                <Text>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}