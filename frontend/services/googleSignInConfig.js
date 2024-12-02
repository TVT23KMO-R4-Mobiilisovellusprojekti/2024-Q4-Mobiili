import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  //Web client ID puuttuu, laitetaan ENViin jos/kun Google Sign In toimii  
  webClientId: WEB_CLIENT_ID,
});