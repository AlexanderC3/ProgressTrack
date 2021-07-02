import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./firebase/UserProvider";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ActiveRedirect from "./router/ActiveRedirect";
import Exercises from "./pages/Exercises";
import Categories from "./pages/Categories";
import Overview from "./pages/Overview";

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
            <ActiveRedirect exact path="/profile" component={Profile} />
            <ActiveRedirect exact path="/overview" component={Overview} />
            <ActiveRedirect exact path="/exercises" component={Categories} />
            <ActiveRedirect
              exact
              path="/exercises/:name"
              component={Exercises}
            />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
