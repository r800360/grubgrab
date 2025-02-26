import { Dimensions, Image, StyleSheet, Platform, Text, View } from 'react-native';
import { Button } from "react-native-paper";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '../../config/firebaseConfig';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');


export default function HomeScreen() {

    const navigation = useNavigation();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "270299726219-qvjnijjm9m6489b37qa2e8a6us32ogju.apps.googleusercontent.com", 
            offlineAccess: false,
            scopes: ['profile', 'email']
        });
    }, []);

    const handleGoogleSignIn = async () => {
        
        try {
          await GoogleSignin.signOut();
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const tokens = await GoogleSignin.getTokens();
          const idToken = tokens.idToken;
    
          if (!idToken) {
            throw new Error("No ID token returned from Google Sign-In");
          }
    
          const googleCredential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, googleCredential);
    
          const email = userCredential.user.email;
          if (!email?.endsWith('@ucsd.edu')) {
            await auth.signOut();
            Alert.alert("Access Denied", "Only UCSD emails are allowed.");
          } else {
            Alert.alert("Success", "Welcome to Grubgrab!");
            navigation.navigate("Landing"); // Navigate to Landing Screen
            //router.push("/Landing");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Login Failed", "Please try again.");
        }
      };





  return (
    <View style={styles.baseContainer}>
      <View style={styles.foodBackgroundContainer}>
        <Image
          source = {require('../../assets/images/GreenFoodBackground.png')}
          style = {styles.foodBackground}
        />
      </View>
      <View style={styles.stepContainer}>
        <View>
          <Text style={styles.titleText}>GrubGrab with us!</Text>
          <Text style={styles.subtitleText}>Create an account to start saving and munching</Text>
        </View>
        <View>
        <Button 
          icon="google" 
          mode="contained"
          buttonColor='#604c3e'
          onPress={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
          <Text style={styles.subtitleText}>Redirects to UCSD SSO Sign In</Text>
        </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  foodBackgroundContainer: {
    flex: 3, // Takes 60% of screen height
    width: '100%',
  },
  titleContainer: {
    flex:2,
    flexDirection: 'row',
    alignItems: 'center',    
    // position: 'absolute'
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center'
  },
  subtitleText: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center'
  },
  stepContainer: {
    flex:2,
    justifyContent: 'space-around',
    alignItems: 'center',
    //gap: 8,
    //marginBottom: 8,
  },
  foodBackground: {
    width: '100%',
    height: '100%',
  },
});
