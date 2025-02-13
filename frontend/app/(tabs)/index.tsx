import { Dimensions, Image, StyleSheet, Platform, Text, View } from 'react-native';
import { Button } from "react-native-paper";
import * as Google from 'expo-auth-session/providers/google';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, signInWithCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from '@/config/firebaseConfig';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// import auth from '@react-native-firebase/auth';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

const { height } = Dimensions.get('window');

// useEffect(() => {
//   GoogleSignin.configure({
//     webClientId: "270299726219-j3ahpr398tifnafcij7bge1kdvq8ntff.apps.googleusercontent.com", // Get from Firebase Console (OAuth client)
//     offlineAccess: false,
//   });
// }, []);



WebBrowser.maybeCompleteAuthSession();

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const email = result.user.email;
    if (!email?.endsWith('@ucsd.edu')) {
      await auth.signOut();
      Alert.alert("Access Denied", "Only UCSD emails are allowed.");
    } else {
      Alert.alert("Success", "Welcome to GrubGrab!");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Login Failed", "Please try again.");
  }
};

// const signInWithGoogle = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const { idToken } = await GoogleSignin.getTokens();
//     const googleCredential = GoogleAuthProvider.credential(idToken);
//     const userCredential = await signInWithCredential(auth, googleCredential);

//     const email = userCredential.user.email;
//     if (!email?.endsWith('@ucsd.edu')) {
//       await auth.signOut();
//       Alert.alert("Access Denied", "Only UCSD emails are allowed.");
//     } else {
//       Alert.alert("Success", "Welcome to GrubGrab!");
//     }
//   } catch (error) {
//     console.error(error);
//     Alert.alert("Login Failed", "Please try again.");
//   }
// };



export default function HomeScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    //expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "270299726219-j3ahpr398tifnafcij7bge1kdvq8ntff.apps.googleusercontent.com",
    androidClientId: "270299726219-j3ahpr398tifnafcij7bge1kdvq8ntff.apps.googleusercontent.com",
    webClientId: "270299726219-j3ahpr398tifnafcij7bge1kdvq8ntff.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const email = userCredential.user.email;
          if (!email?.endsWith('@ucsd.edu')) {
            auth.signOut();
            Alert.alert("Access Denied", "Only UCSD emails are allowed.");
          } else {
            Alert.alert("Success", "Welcome to GrubGrab!");
          }
        })
        .catch((error) => {
          console.error("Firebase Sign-In Error:", error);
          Alert.alert("Login Failed", "Please try again.");
        });
    }
  }, [response]);

  return (
    <View style={styles.baseContainer}>
      <View style={styles.foodBackgroundContainer}>
        <Image
          source = {require('@/assets/images/GreenFoodBackground.png')}
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
          disabled={!request}
          onPress={() => promptAsync()}
        >
          Sign in with Google
        </Button>
          <Text style={styles.subtitleText}>Redirects to UCSD SSO Sign In</Text>
        </View>
      </View>
    </View>
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/GreenFoodBackground.png')}
    //       style={styles.foodBackground}
    //     />
    //   }>
      /* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to grubgrab!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView> */
    //</ParallaxScrollView>
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
