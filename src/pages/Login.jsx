
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Card, CardBody, CardHeader, CloseButton, Container, FormControl, FormLabel, Input, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginService } from "../actions";

const Login = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn, token } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({});
  const {
    isOpen: isVisible, onClose
  } = useDisclosure({ defaultIsOpen: true })
  const [errors, setErrors] = useState(false);

  const navigate = useNavigate();

  const attemptLogin = () => {
    setIsSubmitting(true);
    // loginService(loginData);
    // const response = loginUser(loginData);
    dispatch(loginService(loginData));
  }

  useEffect(() => {
    if(isLoggedIn && token){
      navigate("/admin");
    } else {
      setErrors(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, token]);

  const checkForEnter = (e) => {
    if(e.keyCode === 13){
      attemptLogin();
    }
  }


  return(
    <>
      {Boolean(searchParams.get("mustbesignedin")) && isVisible && (
        <Alert status='error' variant='left-accent'>
          <AlertIcon />
          <Box style={{width: '100%'}}>
            <AlertTitle>You must be signed in to view that page.</AlertTitle>
            <AlertDescription>Only administrators should access this page.</AlertDescription>
          </Box>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={onClose}
          />
        </Alert>
      )}
      {errors.length > 0 && (
        <Alert status='error' variant='left-accent'>
          <AlertIcon />
          <Box style={{width: '100%'}}>
            <AlertTitle>An error has occured</AlertTitle>
            <AlertDescription>Please check the email and password combination and retry logging in.</AlertDescription>
          </Box>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={onClose}
          />
        </Alert>
      )}
      <Container style={{marginTop: 20}}>
        <Card>
          <CardHeader>
            <h1 className="title">Login</h1>
          </CardHeader>
          <CardBody>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type='email' onKeyDown={(e) => checkForEnter(e)} onChange={(e) => setLoginData({...loginData, email: e.target.value })} />
            </FormControl>
            <br/>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' onKeyDown={(e) => checkForEnter(e)} onChange={(e) => setLoginData({...loginData, password: e.target.value })}/>
            </FormControl>
            <br/>
            <Button
              mt={4}
              colorScheme='teal'
              // isLoading={isSubmitting}
              isLoading={false}
              type='submit'
              onClick={() => attemptLogin()}
            >
              Login
            </Button>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    user: state.user,
    token: state.token
  }
}

export default connect(mapStateToProps)(Login);