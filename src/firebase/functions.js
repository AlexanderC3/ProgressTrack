import { firestore } from "./config";

// Functie die zorgt voor het aanmaken en wijzigen van een batch

export const createCat = async (cat) => {
  // get a reference to the firestore document
  const docRef = firestore.collection("exercises");

  // write to CLoud Firestore
  return docRef.add(cat);
};

export const addRegistration = async (exercise, user) => {
  // get a reference to the firestore document
  const docRef = firestore
    .collection("users")
    .doc(user)
    .collection("registrations");

  // write to CLoud Firestore
  return docRef.add(exercise);
};
