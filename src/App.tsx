import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './config/theme';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LocationDetailPage from './pages/LocationDetailPage';
import { queryClient } from './queryClient';
import { ToastProvider } from './components/common/ToastProvider';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="location" element={<LocationDetailPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
