import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { firestore } from "../firebase/config";
import { useSession } from "../firebase/UserProvider";

//Code die ervoor zorgt dat bepaalde paginas enkel zichtbaar zijn wanneer een gebruiker ingelogd is. Wordt duidelijk overlopen in playlist op linkedin learning.

const ActiveRedirect = ({ component: Component, ...rest }) => {
  const { user } = useSession();
  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!!user) {
      const docRef = firestore
        .collection("users")
        .where("email", "==", user.email);
      docRef.onSnapshot((querySnapshot) => {
        const userLoggedIn = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (userLoggedIn[0]) {
          setActiveUser(true);
        }

        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const formClassname = `${loading ? "loading" : ""}`;

  return (
    <section className={formClassname}>
      {!loading && (
        <Route
          {...rest}
          render={(props) => {
            if (activeUser) {
              return <Component {...props} />;
            } else {
              return <Redirect to="/login" />;
            }
          }}
        />
      )}
    </section>
  );
};

export default ActiveRedirect;
