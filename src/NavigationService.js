import { NavigationContainerRef } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

let navigator = null;

function setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef;
}

function navigate(routeName, params) {
    navigator?.navigate(routeName, params);
}

function goBack() {
    navigator?.dispatch(CommonActions.goBack());
}

export default {
    navigate,
    setTopLevelNavigator,
    goBack,
};
