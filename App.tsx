import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View, PermissionsAndroid, TouchableOpacity, Image } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from "react-native-google-signin";
import messaging from '@react-native-firebase/messaging';
function App({ navigation }: any): React.JSX.Element {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [userInput, setUserInput] = useState({ email: "", password: "" });

  GoogleSignin.configure({
    webClientId: '944863983417-3tp5jr6bd053ok838r2qan3n71c22967.apps.googleusercontent.com'
  })

  async function onGoogleButtonPress() {
    //check xem thiết bọ có hỗ trợ Google Play hay không 
   try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    });

    //Get user Token
    const { idToken, user} = await GoogleSignin.signIn();
    console.log(idToken, user);
    Alert.alert("Đăng nhập thành công")
    navigation.navigate("Home", {user: user})
    //tạo một Google credential vớI token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
    //đăng nhập bới credential
    return auth().signInWithCredential(googleCredential);
   } catch (error) {
    console.log(error);
   }
  }


  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    registerAppWithFCM();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, []);

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App</Text>
      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40, borderRadius: 10, padding: 10 }} placeholder="Enter Email" onChangeText={(text) => {
          setEmail(text);
        }} />

      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40, borderRadius: 10, padding: 10 }} placeholder="Enter Password" onChangeText={(text) => {
          setPassword(text);
        }} />


      <TouchableOpacity style={{ width: 100, height: 40, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 15, marginBottom: 10 }}
        onPress={() => {
          auth().signInWithEmailAndPassword(email, password)
            .then(() => {
              Alert.alert("Đăng nhập thành công");
              navigation.navigate('Home', {user: user})
            })
            .catch(error => {
              if (error.code === 'auth/user-not-found') {
                Alert.alert('Tài khoản email chưa được đăng kí!');
              }

              if (error.code === 'auth/wrong-password') {
                Alert.alert('Địa chỉ email không hợp lệ!');
              }
            })
        }}>
        <Text>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ width: 100, height: 40, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 10 }}
        onPress={() => {
          auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              console.log('User account created & signed in!');
              Alert.alert("Đăng kí thành công!")
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Tài khoản email đã được sử dụng!');
              }

              if (error.code === 'auth/invalid-email') {
                Alert.alert('Địa chỉ email không hợp lệ!');
              }
              console.log(error);

            })
        }}>
        <Text>Đăng kí</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ width: 250, height: 40, backgroundColor: 'green', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
       onPress={onGoogleButtonPress}
      >
        <Image source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-google-160-189824.png' }} style={{ width: 30, height: 30, position: 'absolute', start: 10 }} />
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Đăng nhập bằng google</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App;