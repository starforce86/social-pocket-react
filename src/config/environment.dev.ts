import { LanguageType } from 'store/reducers/locale/langugeType'

export const environment = {
  firebase: {
    apiKey: 'AIzaSyCVZ97tH6a02Yh9jdJowJewXRjSePIn9s4',
    authDomain: 'maxim-react-social-network-upd.firebaseapp.com',
    databaseURL: 'https://maxim-react-social-network-upd.firebaseio.com',
    projectId: 'maxim-react-social-network-upd',
    storageBucket: 'maxim-react-social-network-upd.appspot.com',
    messagingSenderId: '512487036989'
  },
  settings: {
    enabledOAuthLogin: true,
    appName: 'Green',
    defaultProfileCover: 'https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57',
    defaultLanguage: LanguageType.English
  },
  theme: {
    primaryColor: '#00b1b3',
    secondaryColor: '#4d545d'
  },
  constants: {
    maxFriends: 2
  }
}
