import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useSession } from "../firebase/UserProvider";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState([]);
  const { user } = useSession();
  const history = useHistory();

  useEffect(() => {
    const userRef = firestore
      .collection("users")
      .where("email", "==", user.email);

    const unsubscribe = userRef.onSnapshot((querySnapshot) => {
      const currentUser = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserData(currentUser[0]);
    });
    return unsubscribe;
  }, [user.email]);

  return (
    <div style={{ marginTop: "7em", width: "80%", margin: "8em auto" }}>
      <h3 style={{ paddingBottom: ".3em" }}>My Profile</h3>
      <button onClick={() => history.goBack()} className="goBackButton">
        Go back
      </button>
      <br />
      <br />
      <br />
      <form style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <div>
            <label style={{ width: "100%" }}>
              <b>First name</b>
              <input
                className="formInput profileInput"
                type="text"
                required
                value={userData.firstname}
                readOnly
              />
            </label>
          </div>
          <br />
          <div>
            <label style={{ width: "100%" }}>
              <b>Last name</b>
              <input
                className="formInput profileInput"
                type="text"
                required
                value={userData.lastname}
                readOnly
              />
            </label>
          </div>
          <br />
          <div>
            <label style={{ width: "100%" }}>
              <b>Username</b>
              <input
                className="formInput profileInput"
                type="text"
                required
                value={userData.username}
                readOnly
              />
            </label>
          </div>
          <br />
          <div>
            <label style={{ width: "100%" }}>
              <b>Email</b>
              <input
                className="formInput profileInput"
                type="text"
                required
                value={userData.email}
                readOnly
              />
            </label>
          </div>
        </div>
      </form>
      <br />
      <button onClick={() => history.push("/overview")}>
        My registrations
      </button>
    </div>
  );
};

export default Profile;
