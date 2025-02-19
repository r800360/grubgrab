// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { TextInput, Chip } from 'react-native-paper';
// import { auth } from "@/config/firebaseConfig";
// import firestore from "@/config/firebaseConfig";
// import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

// export default function AccountScreen({ navigation }: { navigation: any }) {
//   const user = auth.currentUser;
//   const stripe = useStripe();
//   const [name, setName] = useState('');
//   const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
//   const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  
//   const availableDietaryOptions = ["Vegan", "Vegetarian", "Nut-Free", "Gluten-Free"];

//   useEffect(() => {
//     if (user) {
//       const userRef = firestore.collection('users').doc(user.uid);
//       userRef.get().then((doc) => {
//         if (doc.exists) {
//           const data = doc.data();
//           setName(data?.name || '');
//           setDietaryRestrictions(data?.dietaryRestrictions || []);
//           setHasCompletedSetup(data?.hasCompletedSetup || false);
//         }
//       });
//     }
//   }, []);

//   const handleSaveProfile = async () => {
//     if (!user) return;

//     // Create a Stripe Customer for the user (server-side preferred)
//     const customerResponse = await fetch('https://your-server.com/create-stripe-customer', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: user.email })
//     });

//     const { customerId } = await customerResponse.json();

//     // Save user data to Firestore
//     await firestore.collection('users').doc(user.uid).set({
//       name,
//       dietaryRestrictions,
//       hasCompletedSetup: true,
//       stripeCustomerId: customerId
//     });

//     setHasCompletedSetup(true);
//     navigation.navigate('Home'); // Unlock Home
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Set Up Your Profile</Text>
//       <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />

//       <Text style={styles.label}>Dietary Restrictions</Text>
//       <View style={styles.chipContainer}>
//         {availableDietaryOptions.map((option) => (
//           <Chip
//             key={option}
//             selected={dietaryRestrictions.includes(option)}
//             onPress={() => setDietaryRestrictions((prev) =>
//               prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
//             )}
//           >
//             {option}
//           </Chip>
//         ))}
//       </View>

//       <Button title="Save Profile" onPress={handleSaveProfile} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   input: { marginBottom: 10 },
//   label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
//   chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }
// });
