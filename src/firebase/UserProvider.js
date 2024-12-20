import React, { useEffect, useState, useContext, createContext } from "react";
import firebase from "firebase/app";

//Deze module zorgt ervoor dat het altijd mogelijk is de uid, email ... van de ingelogde user op te vragen en te gebruiken.

export const UserContext = React.createContext();
export const UserProvider = (props) => {
  const [session, setSession] = useState({
    user: null,
    loading: true,
    isActive: false,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setSession({
        loading: false,
        user,
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={session}>
      {!session.loading && props.children}
    </UserContext.Provider>
  );
};

export const useSession = () => {
  let session = useContext(UserContext);
  if (session == null) {
    session = createContext({ name: "", auth: false });
  }
  return session;
};
