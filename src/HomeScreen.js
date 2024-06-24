import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging'
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const HomeScreen = () => {

const navigation = useNavigation();

useEffect(()=>{
  myToken();
},[]);

const myToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log("fcm_token: " + token);
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

useEffect(() => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Handle the incoming message here
    const { title, body } = remoteMessage.notification;
    // alert(`${title}\n${body}`);
    displayNotification(title, body);
  });
  return unsubscribe; // Cleanup function to unsubscribe when the component unmounts
}, []);

const displayNotification = async (title, body) => {
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    vibration: true,
    sound: 'default',
    importance: AndroidImportance.HIGH,
    vibrationPattern: [300, 500],
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

  return (
    <View
    style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    }}>

        <TouchableOpacity
        onPress={()=>{
            navigation.navigate('NotificationScreen');
        }}>
        <Text style={{color:'black'}}>Open Notification</Text>
        </TouchableOpacity>

    </View>
  )
}

export default HomeScreen