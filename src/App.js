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
import Workouts from "./pages/Workouts";
import WorkoutDetails from "./pages/WorkoutDetails";
import MainLayout from "./layouts/MainLayout";
import { EditWorkout } from "./pages/EditWorkout";

//Implementeren van alle modules binnenin de pages folder. Als eerste wordt de UserProvider geladen (data van ingelogde user zie UserProvider.js).
//Vervolgens BrowserRouter (default nodig)
//Daarna wordt de bovenst navbar geladen.
//Switch zorgt ervoor dat er gewisseld kan worden tussen de verschillende modules (anders zou maar 1 pagina geladen kunnen worden).

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
            <Route
              exact
              path="/profile"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/overview"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <Overview />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/exercises"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/workouts"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <Workouts />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/exercises/:name"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <Exercises />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/workouts/:name"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <WorkoutDetails />
                  </MainLayout>
                </ActiveRedirect>
              )}
            />
            <Route
              exact
              path="/editworkout/:workout"
              render={() => (
                <ActiveRedirect>
                  <MainLayout>
                    <EditWorkout />
                  </MainLayout>
                </ActiveRedirect>
              )}
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
