import React, { useState } from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../common/ErrorBoundary';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 4 },
          mt: '64px', // Height of the header
        }}
      >
        <Container maxWidth="lg">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;