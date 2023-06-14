import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UseContext } from '../hook/useStatus';
axios.defaults.baseURL = 'http://localhost:4000';

function SignIn() {
  const navigate = useNavigate();
  const [chooseLogin, setChooseLogin] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const { setIsLogin,setVc } = UseContext();

  const handleLogin = async () => {
    if (!file) {
      alert('請選擇JSON文件');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fileContent', fileContent);
      const response = await axios.post('/api/login', formData);
      setLoading(false);
      const result = response.data;
      if (result === true) {
        setIsLogin(1);
        setVc(fileContent)
        navigate('/voting-list');
      } else {
        alert('登錄失敗');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (name === '' || age <= 0) {
      alert('請輸入有效的姓名和年齡');
      return;
    }
    try {
      let formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      setLoading(true);
      const response = await axios.post('/api/register', formData);
      setLoading(false);
      const downloadLink = document.createElement('a');
      downloadLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(response.data)
      )}`;
      downloadLink.download = `${JSON.parse(JSON.stringify(response.data)).vc.credentialSubject.name}_DID.json`;
      downloadLink.click();
      setChooseLogin(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };
    reader.readAsText(selectedFile);
  };

  const toggleForm = () => {
    setChooseLogin(!chooseLogin);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };
    reader.readAsText(selectedFile);
  };

  return (
    <Grid style={{ backgroundColor: 'black', minHeight: '100vh' }} container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper style={{ 
            padding: 20,
            paddingTop: 40, 
            paddingBottom: 40,
            borderRadius: 20,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }} elevation={5}>
          <Typography style={{ fontFamily: 'Lobster', fontSize: 50 }} variant="h5" component="h2" align="center" gutterBottom>
            {chooseLogin ? 'Login' : 'Register'}
          </Typography>
          {loading && (
            <Box mt={2} align="center">
              <CircularProgress />
            </Box>
          )}
          {!chooseLogin && (
            <Box style={{ width: '70%' }} mt={5}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
          )}
          {!chooseLogin && (
            <Box style={{ width: '70%' }} mt={1.5}>
              <TextField
                label="Age"
                variant="outlined"
                type="number"
                fullWidth
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Box>
          )}
          {chooseLogin && (
            <Box style={{ width: '70%' }} mt={5}>
              <Button
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ backgroundColor: 'black', color: 'white', marginTop: 0, borderRadius: 10, width: '100%' }}
                variant="contained"
                component="label"
                fullWidth
                color="primary"
              >
                {fileName ? fileName : 'Choose JSON File'}
                <input type="file" accept=".json" hidden onChange={handleFileChange} />
              </Button>
            </Box>
          )}
          <Box style={{ width: '70%' }} mt={1.5}>
            {chooseLogin ? (
              <Button
              style={{ backgroundColor: 'black', color: 'white', marginTop: 0, borderRadius: 10, width: '100%' }}
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
              >
                Login
              </Button>
            ) : (
              <Button
                style={{ backgroundColor: 'black', color: 'white', marginTop: 10, borderRadius: 10, width: '100%' }}
                variant="contained"
                color="primary"
                onClick={handleRegister}
                fullWidth
              >
                Register
              </Button>
            )}
          </Box>
          <Box mt={2} align="center">
            <Button style={{ color: 'black' }} color="secondary" onClick={toggleForm}>
              {chooseLogin ? 'Create Account' : 'Already have an account?'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SignIn;
