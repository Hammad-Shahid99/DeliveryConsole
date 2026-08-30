import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { RouteProvider } from './src/state/useRouteStore';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <RouteProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RouteProvider>
    </SafeAreaProvider>
  );
}

export default App;
