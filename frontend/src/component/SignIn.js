import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    navigate('/voting-list');
  };
  const handleRegister = () => {
    // createIdentity();
  }

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 20 }} elevation={5}>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            {isLogin ? 'Login' : 'Register'}
          </Typography>
          {!isLogin && (
            <>
              <TextField label="Name" variant="outlined" fullWidth margin="normal" />
              <TextField label="Age" variant="outlined" type="number" fullWidth margin="normal" />
            </>
          )}
          {isLogin && (
            <>
              <TextField label="DID" variant="outlined" fullWidth margin="normal" />
            </>
          )}
          {isLogin? 
          <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
            'Login'
          </Button>:
          <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
          'Register'
          </Button>
          }
          <Box mt={2} align="center">
            <Button color="secondary" onClick={toggleForm}>
              {isLogin ? 'Create Account' : 'Already have an account?'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SignIn;
