// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { auth } from '@/config/firebaseConfig';

// export default function LandingScreen({ navigation }) {
//   const handleLogout = async () => {
//     await auth.signOut();
//     navigation.replace('Home'); // Navigate back to HomeScreen
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Welcome to the Landing Screen!</Text>
//       <Button title="Logout" onPress={handleLogout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
