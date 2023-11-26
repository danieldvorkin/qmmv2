import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Container,
  Card, 
  CardBody, 
  CardHeader,
} from '@chakra-ui/react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Perform registration logic here
    // For simplicity, we'll just log the values
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container style={{marginTop: 20}}>
      <Card>
        <CardHeader>
          <h1 className="title">Register</h1>
        </CardHeader>
        <CardBody>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl mt="4">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl mt="4">
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          {error && (
            <Alert status="error" mt="4">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <br/>
          
          <Button colorScheme="teal" mt="4" onClick={handleRegister}>
            Register
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Register;