import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./firebase/UserProvider";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ActiveRedirect from "./router/ActiveRedirect";
import Exercises from "./pages/Exercises";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <br />
        <div className="App">
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <ActiveRedirect exact path="/dashboard" component={Dashboard} />
            <ActiveRedirect
              exact
              path="/exercises/:name"
              component={Exercises}
            />
          </Switch>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
