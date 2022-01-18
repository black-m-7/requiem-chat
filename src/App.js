import './App.css';
import logo from './assets/logo.png'
import send from './assets/send.png'
import React, { useState, useEffect, useContext, useRef } from 'react' 
import { Navigate, Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMJbLHscz5AIoAk_sDgKj5HQ35Rxg1wK8",
  authDomain: "requiem-collective.firebaseapp.com",
  projectId: "requiem-collective",
  storageBucket: "requiem-collective.appspot.com",
  messagingSenderId: "533584097808",
  appId: "1:533584097808:web:3ac59df36d3f891c7e1095"
};

const app = initializeApp(firebaseConfig);

const AuthContext = React.createContext()
const db = getFirestore()
const auth = getAuth()

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [])

  return (
    <AuthContext.Provider value={{currentUser}}>
      {children}
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="App">
        <Routes>
          
            <Route path="/" element={<ChatRoom/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
        </Routes>
        </div>
      </Router>
    </AuthProvider>
    
  );
}

function SignUp() {
  const [user, setUser] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [currentUser, setCurrentUser] = useState(false)

  const validate = () => {
    if (user.password !== user.confirmPassword) setError("Passwords don't match")
    else setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate()
    try {
      createUserWithEmailAndPassword(auth, user.email, user.password)
      updateProfile(auth.currentUser, {
        displayName: user.displayName
      })
      setCurrentUser(true)
    } catch (e) {
      alert(e)
    }
  }

  if (currentUser) return <Navigate to="/"/>

  return (
    <div className="SignUp">
      <h1>REQUIEM Collective</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text"
              className="form-control"
              placeholder="Display Name"
              onChange={(e) => {setUser({...user, displayName: e.target.value})}}
              required/>
        <input type="email"
              className="form-control"
              placeholder="Email" 
              onChange={(e) => {setUser({...user, email: e.target.value})}}
              required/>
        <input type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {setUser({...user, password: e.target.value})}}
              required/>
        <input type="password"
              className="form-control"
              placeholder="Confirm Password"
              onChange={(e) => {setUser({...user, confirmPassword: e.target.value})}}
              required/>
        <button type="submit" className="btn">Sign Up</button>
        <p className="error">{error}</p>
        <p className="signup"> Have an account? <Link to="/signin">Sign In!</Link></p>
      </form>
    </div>
  )
}

function SignIn() {
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const {currentUser} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      signInWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      alert(error);
    }
  }

  if(currentUser) return <Navigate to="/" replace/>

  return (
    <div className="SignIn">
      <img className="logo" src={logo} alt="REQUIEM Logo"/>
      <form className="form" onSubmit={handleSubmit}>
        <input type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => {setUser({...user, email: e.target.value})}}
              required/>
        <input type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => {setUser({...user, password: e.target.value})}}
              required/>
        <button type="submit" className="btn">Sign In</button>
        <p className="signup"> Don't have an account? <Link to="/signup">Sign Up!</Link></p>
      </form>
    </div>
  )
}

function ChatRoom() {
  const {currentUser} = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const dummy = useRef(null);

  useEffect(() => {
    let test = false
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, orderBy("createdAt"), limit(50))
    const unsub = onSnapshot(q, (querySnapshot) => {
      const msgs = []
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data())
      })
      if(!test) 
      setMessages(msgs)
    })
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
    return () => {test=true}
  }, [messages])

  const handleSignOut = (e) => {
    signOut(auth).then(() => {
      console.log("User signed out")
    }).catch((e) => {
      alert(e)
    })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    const {uid, displayName} = auth.currentUser
    const messagesRef = collection(db, "messages")
    await addDoc(messagesRef, {
      uid: uid,
      name: displayName,
      text: text,
      createdAt: serverTimestamp()
    })
    setText("")
  }

  if (!currentUser) return <Navigate to="/signin" replace/>

  return(
    <div className="ChatRoom">
      <header>
        <h1> REQUIEM Collective</h1>
        <button className="btn" onClick={handleSignOut}>Sign Out</button>
      </header>
      <main>
        {messages && messages.map(msg => <ChatMessage key={`${msg.uid}-${msg.createdAt}`} message={msg}/>)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input className="form-control" value={text} placeholder="Enter message here..." onChange={(e) => {setText(e.target.value)}}required/>
        <button type="submit" className="btn"><img src={send} alt="Send"></img></button>
        </form>
    </div>
  )
}

function ChatMessage(props) {
  const {text, name} = props.message
  const messageClass = name === auth.currentUser?.displayName ? 'sent' : 'received'
  
  return (
    <div className={`message ${messageClass}`}>
      <h3 className="sender">{name}</h3>
      <p>{text}</p>
    </div>
  )

}

export default App;
