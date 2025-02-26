import React, {useEffect, useState} from 'react';
import { Image, Alert, View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../../config/firebaseConfig';
import {StripeProvider, usePaymentSheet} from '@stripe/stripe-react-native';
//import {MERCHANT_ID, API_URL} from '@/config/Constants';
import { publishableKey } from '../../config/constants';




export default function LandingScreen({navigation}: {navigation: any}) {
//     const [ready, setReady] = useState(false);
//     const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();

// useEffect(() => {
//     initialisePaymentSheet();
//   }, []);

// const initialisePaymentSheet = async () => {
//     const {setupIntent, ephemeralKey, customer} =
//       await fetchPaymentSheetParams();
//     console.log(setupIntent);
//     const {error} = await initPaymentSheet({
//       customerId: customer,
//       customerEphemeralKeySecret: ephemeralKey,
//       setupIntentClientSecret: setupIntent,
//       merchantDisplayName: 'Example Inc.',
//       applePay: {
//         merchantCountryCode: 'US',
//       },
//       googlePay: {
//         merchantCountryCode: 'US',
//         testEnv: true,
//         currencyCode: 'usd',
//       },
//       allowsDelayedPaymentMethods: true,
//       returnURL: 'stripe-example://stripe-redirect',
//     });
//     if (error) {
//       Alert.alert(`Error code: ${error.code}`, error.message);
//     } else {
//       setReady(true);
//     }
//   };

//   const fetchPaymentSheetParams = async () => {
//     const response = await fetch(`/payment-sheet-setup-intent`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     const {setupIntent, ephemeralKey, customer} = await response.json();

//     return {
//       setupIntent,
//       ephemeralKey,
//       customer,
//     };
//   };

//   async function buy() {
//     const {error} = await presentPaymentSheet();

//     if (error) {
//       Alert.alert(`Error code: ${error.code}`, error.message);
//     } else {
//       Alert.alert('Success', 'The payment method was setup successfully');
//       setReady(false);
//     }
//   }


  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace('Home'); // Navigate back to HomeScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Landing Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
