import { firestore } from "./config";

export const createUserDocument = async (user) => {
  // get a reference to the firestore document
  const docRef = firestore.doc(`/users/${user.uid}`);

  // create user object
  const userProfile = {
    uid: user.uid,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  // write to CLoud Firestore
  return docRef.set(userProfile);
};

export const updateUserDocument = async (user) => {
  const docRef = firestore.doc(`/users/${user.uid}`);
  return docRef.update(user);
};
