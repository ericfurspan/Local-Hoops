import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, SocialIcon } from 'react-native-elements';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import Logo from '../../../../assets/img/logo_orange_ball.png';
import global from '../../../styles/global';
import styles from './style';

const AuthLanding = ({
  loginApple,
  loginFacebook,
  loginGoogle,
  redirectToLogin,
  redirectToSignup,
}) => {
  return (
    <View style={[global.authContainer, global.alignCenter]}>
      <Image source={Logo} style={styles.logo} />
      <Text style={global.authHeading}>Find basketball courts, anywhere</Text>
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={styles.socialLoginBtn}
        cornerRadius={100}
        onPress={loginApple}
      />
      <SocialIcon
        button
        type="facebook"
        style={styles.socialLoginBtn}
        fontStyle={styles.buttonSize}
        title="Sign in with Facebook"
        onPress={loginFacebook}
      />
      <SocialIcon
        button
        type="google"
        style={styles.socialLoginBtn}
        fontStyle={styles.buttonSize}
        title="Sign in with Google"
        onPress={loginGoogle}
      />
      <Button
        title="Sign in with Email"
        buttonStyle={styles.actionBtn}
        type="clear"
        onPress={redirectToLogin}
      />
      <Button
        title="Sign up with Email"
        type="clear"
        buttonStyle={styles.actionBtnAlt}
        titleStyle={styles.actionBtnTitleAlt}
        onPress={redirectToSignup}
      />
    </View>
  );
};

export default AuthLanding;
