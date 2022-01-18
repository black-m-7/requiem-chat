import './App.css';
import logo from './assets/logo.png'
import send from './assets/send.png'
import React, { useState, useEffect, useContext } from 'react' 
import { Navigate, Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import app from './config'
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";


const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false)

  useEffect(() => {
    const auth = getAuth()
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
      const auth = getAuth()
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
      const auth = getAuth()
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

  const handleSignOut = (e) => {
    const auth = getAuth()
    signOut(auth).then(() => {
      console.log("User signed out")
    }).catch((e) => {
      alert(e)
    })
  }

  if (!currentUser) return <Navigate to="/signin" replace/>

  return(
    <div className="ChatRoom">
      <header>
        <h1> REQUIEM Collective</h1>
        <button className="btn" onClick={handleSignOut}>Sign Out</button>
      </header>
      <main>
        <form>
        <input className="form-control" placeholder="Enter message here..." />
        <button type="submit" className="btn"><img src={send} alt="Send"></img></button>
        </form>
      </main>
    </div>
  )
}

export default App;
