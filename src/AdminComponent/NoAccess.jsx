import React from 'react'
import { Typography, Container } from '@mui/material';
import Button from '@mui/joy/Button';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const NoAccess = () => {
    return (
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
          }}
        >

          <LockOutlinedIcon
            sx={{
              fontSize: '4rem',
              color: 'error.main',
              mb: 2,
            }}
          />
    

          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Forbidden
          </Typography>
    

          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
            You do not have permission to access this page.
          </Typography>
    
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            If you believe this is an error, please contact your administrator.
          </Typography>
    

          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              padding: '10px 20px',
            }}
          >
            Go to Home
          </Button>
        </Container>
  )
}


