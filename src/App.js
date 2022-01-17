import './App.css';
import logo from './assets/logo.png'
import send from './assets/send.png'

function App() {
  return (
    <div className="App">
      {/* <SignIn/> */}
      <ChatRoom/>
      {/* <SignUp/> */}
    </div>
  );
}

function SignUp() {
  return (
    <div className="SignUp">
      <h1>REQUIEM Collective</h1>
      <form className="form">
        <input type="text" className="form-control" placeholder="Display Name"/>
        <input type="email" className="form-control" placeholder="Email" />
        <input type="password" className="form-control" placeholder="Password" />
        <input type="password" className="form-control" placeholder="Confirm Password" />
        <button type="submit" className="btn">Sign Up</button>
        <p className="signup"> Have an account? <a href="#">Sign In!</a></p>
      </form>
    </div>
  )
}

function SignIn() {
  return (
    <div className="SignIn">
      <img className="logo" src={logo} alt="REQUIEM Logo"/>
      <form className="form">
        <input type="email" className="form-control" placeholder="Email" />
        <input type="password" className="form-control" placeholder="Password" />
        <button type="submit" className="btn">Sign In</button>
        <p className="signup"> Don't have an account? <a href="#">Sign Up!</a></p>
      </form>
    </div>
  )
}

function ChatRoom() {
  return(
    <div className="ChatRoom">
      <header>
        <h1> REQUIEM Collective</h1>
        <button className="btn">Sign Out</button>
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
