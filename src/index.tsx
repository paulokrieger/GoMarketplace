import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';

import light from './styles/themes/light';
import dark from './styles/themes/dark';

import Routes from './routes';
import AppContainer from './hooks';

const App: React.FC = () => {
  const [theme, setTheme] = useState(light);
  const toogleTheme = useCallback(() => {
    setTheme(theme.title === 'light' ? dark : light);
  }, [theme.title]);

  return (
    <View style={{ backgroundColor: '#312e38', flex: 1 }}>
      <AppContainer>
        <ThemeProvider theme={theme}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={theme.title === 'light' ? '#EBEEF8' : '#111'}
          />
          <Routes toggleTheme={toogleTheme} />
        </ThemeProvider>
      </AppContainer>
    </View>
  );
};

export default App;
