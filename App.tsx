import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import auth from '@react-native-firebase/auth';
function App(): React.JSX.Element {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    </View>
  )
}

export default App;