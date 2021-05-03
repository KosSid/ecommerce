import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const config = {
    apiKey: "AIzaSyDzOcsCK5Fs1UxoU97I5qCKTWBya2Ut7kA",
    authDomain: "ecommerce-6e346.firebaseapp.com",
    projectId: "ecommerce-6e346",
    storageBucket: "ecommerce-6e346.appspot.com",
    messagingSenderId: "181251447183",
    appId: "1:181251447183:web:2b824ba84f56a1c1c2d3fa"
};

// initialize firebase app
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
// export
// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
