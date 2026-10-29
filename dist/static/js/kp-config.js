/* KPCambodianmathematics — online database settings
 *
 * By default (KP_FIREBASE = null) the class-management system keeps its data in this browser only
 * ("Local mode"). Teachers can still work fully, back up their data to a file, and students can take
 * exams on the same computer.
 *
 * To put classes, students and scores ONLINE (teachers log in from any device, students take exams on their
 * own phones and scores flow into the gradebook automatically):
 *   1. create a free Firebase project (see FIREBASE_SETUP.md), enable Authentication (Email/Password + Anonymous)
 *      and Cloud Firestore, and publish the rules in firestore.rules;
 *   2. replace null below with the web-app config Firebase gives you, for example
 *
 *   window.KP_FIREBASE = {
 *     apiKey: "AIza...",
 *     authDomain: "your-project.firebaseapp.com",
 *     projectId: "your-project",
 *     storageBucket: "your-project.appspot.com",
 *     messagingSenderId: "1234567890",
 *     appId: "1:1234567890:web:abc123"
 *   };
 */
window.KP_FIREBASE = null;
