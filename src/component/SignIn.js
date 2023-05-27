import React from 'react';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/voting-list');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ padding: 20 }} elevation={5}>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Login
          </Typography>
          <TextField label="Username" variant="outlined" fullWidth margin="normal" />
          <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" />
          <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
            Login
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SignIn;
