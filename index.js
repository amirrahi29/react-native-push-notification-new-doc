import { AppRegistry, AppState } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import NavigationService from './src/NavigationService';

let notificationDisplayed = false;

// Define the displayNotification function
const displayNotification = async (title, body) => {
    try {
        await notifee.requestPermission();
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            vibration: true,
            sound: 'default',
            importance: AndroidImportance.HIGH,
            vibrationPattern: [300, 500],
        });

        // Display a notification only if the app is not in the foreground and notification not already displayed
        if (AppState.currentState !== 'active' && !notificationDisplayed) {
            await notifee.displayNotification({
                title: title,
                body: body,
                android: {
                    channelId,
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
            });
            notificationDisplayed = true; // Set the flag to true after displaying the notification
        }
    } catch (error) {
        console.error('Error displaying notification:', error);
    }
}

// Register the background message handler
const backgroundMessageHandler = async (remoteMessage) => {
    if (remoteMessage) {
        // Handle the incoming message here
        const { title, body } = remoteMessage.notification;
        console.log(`${title}\n${body}`);
        await displayNotification(title, body);
        NavigationService.navigate(ROUTES.NOTIFICATION);
    }
};

// Register the background message handler only once
messaging().setBackgroundMessageHandler(backgroundMessageHandler);

// Register the initial notification handler
messaging().getInitialNotification().then(async (remoteMessage) => {
    if (remoteMessage) {
        // Handle the incoming message here
        const { title, body } = remoteMessage.notification;
        console.log(`${title}\n${body}`);
        await displayNotification(title, body);
        NavigationService.navigate('NotificationScreen');
    }
});

// Register the main component
AppRegistry.registerComponent(appName, () => App);

// Listen to foreground notification events
notifee.onForegroundEvent(async ({ type, detail }) => {
    switch (type) {
        case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
        case EventType.PRESS:
            setTimeout(() => {
                NavigationService.navigate('NotificationScreen');
            }, 1000);
            console.log('User pressed notification', detail.notification);
            break;
    }
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
    switch (type) {
        case EventType.DISMISSED:
            console.log('User dismissed notification background', detail.notification);
            break;
        case EventType.PRESS:
            setTimeout(() => {
                NavigationService.navigate('NotificationScreen');
            }, 1000);
            console.log('User pressed notification background', detail.notification);
            break;
    }
});
