import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View, PermissionsAndroid} from "react-native";
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from "react-native-google-signin";
import messaging from '@react-native-firebase/messaging';
function App(): React.JSX.Element {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  GoogleSignin.configure({
    webClientId: '944863983417-8e8hidghpge964g7io597b2q2jvsjm8u.apps.googleusercontent.com'
  })

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    });

    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }


  useEffect(() =>{
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    registerAppWithFCM();
  },[]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App</Text>
      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40 }} placeholder="Enter Email" onChangeText={(text) => {
          setEmail(text);
        }} />

      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40 }} placeholder="Enter Password" onChangeText={(text) => {
          setPassword(text);
        }} />

      <Button title="Sign In" onPress={() => {
        //sign up
        auth().createUserWithEmailAndPassword(email, password)
          .then(() => {
            console.log('User account created & signed in!');
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
              Alert.alert('That email address is invalid!');
            }
            console.log(error);

          })
      }} />

      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
      />
    </View>
  )
}

export default App;