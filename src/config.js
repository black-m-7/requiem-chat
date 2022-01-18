import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMJbLHscz5AIoAk_sDgKj5HQ35Rxg1wK8",
  authDomain: "requiem-collective.firebaseapp.com",
  projectId: "requiem-collective",
  storageBucket: "requiem-collective.appspot.com",
  messagingSenderId: "533584097808",
  appId: "1:533584097808:web:3ac59df36d3f891c7e1095"
};

const  app = initializeApp(firebaseConfig);

export default app