import firebase from "firebase/app";
import "firebase/auth";
import { createUserDocument } from "./user";

//authenticatie functies met firebase authenticatie.

export const signup = async ({ firstname, lastname, email, password }) => {
  const resp = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const user = resp.user;
  user.role = "user";
  user.firstname = firstname;
  user.lastname = lastname;
  user.username = firstname + " " + lastname;
  await user.updateProfile({ displayName: `${firstname} ${lastname}` });
  await createUserDocument(user);
  return user;
};

export const logout = () => {
  return firebase.auth().signOut();
};

export const resetPassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

export const login = async ({ email, password }) => {
  const resp = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);

  return resp.user;
};
