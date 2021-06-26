import React, { useEffect, useState } from "react";
import { useSession } from "../firebase/UserProvider";
import { firestore } from "../firebase/config";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const { user } = useSession();
  const history = useHistory();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const userRef = firestore
      .collection("users")
      .where("email", "==", user.email);

    const unsubscribe = userRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersRef = firestore.collection("users");

      usersRef.onSnapshot((querySnapshot) => {
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        for (let i = 0; i < users[0].friends.length; i++) {
          for (let j = 0; j < usersList.length; j++) {
            if (users[0].friends[i] === usersList[j].id) {
              users[0].friends[i] =
                usersList[j].firstname + " " + usersList[j].lastname;
            }
          }
        }
        setTimeout(() => {
          setFriends(users[0].friends);
        }, 200);
      });
    });
    return unsubscribe;
  }, [user.email]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <div
      className="add-form-container"
      style={{
        maxWidth: 960,
        margin: "50px auto",
        marginTop: "80px",
      }}
    >
      My profile
      <button
        onClick={goBack}
        style={{
          marginTop: "28px",
          padding: "5px 10px",
          background: "#EDEAEA",
          color: "black",
          borderRadius: "7px",
          fontSize: "17px",
        }}
      >
        Go back
      </button>
      <p>Your user id: {user.uid}</p>
      {friends
        ? friends.map((item, index) => {
            return (
              <div key={index}>
                <p>{item}</p>
              </div>
            );
          })
        : ""}
    </div>
  );
};

export default Profile;
