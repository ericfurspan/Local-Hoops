// import React from 'react';
// import { Button, Text, TextInput, View } from 'react-native';
// import { fireEvent, render, waitFor } from '@testing-library/react-native';
// import AuthLogin from './view';

// test('Login page', async () => {
//   const { getByTestId, getByText, queryByTestId, toJSON } = render(<AuthLogin />);

//   const emailInput = getByTestId('emailInput');
//   fireEvent.changeText(emailInput, 'foo@bar.com');

//   const passwordInput = getByTestId('passwordInput');
//   fireEvent.changeText(passwordInput, 'mysupersecretpassword!');

//   const loginButton = getByTestId('loginButton');
//   fireEvent.press(loginButton);

//   const fbLoginButton = getByTestId('fbLoginButton');
//   fireEvent.press(fbLoginButton);

//   const googleLoginButton = getByTestId('googleLoginButton');
//   fireEvent.press(googleLoginButton);

//   await waitFor(() => expect(queryByTestId('printed-username')).toBeTruthy());

//   expect(getByTestId('printed-username').props.children).toBe(famousWomanInHistory);
//   expect(toJSON()).toMatchSnapshot();
// });
