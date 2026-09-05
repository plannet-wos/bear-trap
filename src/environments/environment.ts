/**
 * Firebase web SDK config for the save-code feature.
 *
 * This is the same `tal-coordinator` project the rest of the Plannet WOS suite
 * shares (see plannet-wos/README.md's Firebase config section) — the API key
 * is intentionally public; security comes from Firestore Security Rules
 * (owned by the plannet-wos hub repo), not from hiding this config. `appId`/
 * `measurementId` are this app's own Web app registration within that shared
 * project (Firebase console → tal-coordinator → Bear Trap Calculator).
 */
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA_ac19dgbIp3hYNOXmet3J_DgjOWckPes',
    authDomain: 'tal-coordinator.firebaseapp.com',
    projectId: 'tal-coordinator',
    storageBucket: 'tal-coordinator.firebasestorage.app',
    messagingSenderId: '931922842986',
    appId: '1:931922842986:web:81d091b736aa9ccd4fc113',
    measurementId: 'G-LLZRXPX7N5',
  },
};
