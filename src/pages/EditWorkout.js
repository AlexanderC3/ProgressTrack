import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
//import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";
import Loader from "../components/Images/loader.gif";

//Todo: moet nog verder geïmplementeerd worden.

export const EditWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const { user } = useSession();
  const params = useParams();
  const workout = params.workout;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workoutRef = firestore
      .collection("users")
      .doc(user.uid)
      .collection("workouts")
      .where("name", "==", workout);

    const unsubscribe = workoutRef.onSnapshot((querySnapshot) => {
      const workoutToEdit = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCurrentWorkout(workoutToEdit[0]);
    });
    return unsubscribe;
  }, [user.uid, workout]);

  const addExercise = (ex) => {
    var ExArray = [];
    if (currentWorkout.exercises !== undefined) {
      if (currentWorkout.exercises.length > 0) {
        ExArray = currentWorkout.exercises;
        ExArray.push(ex);
      }
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, 600);

  return (
    <div style={{ marginTop: "3em" }}>
      {!loading && (
        <div>
          <p>{currentWorkout.name}</p>
          <button onClick={() => addExercise()}>Add exercise</button>

          {/*Toevoegen van modal -> onsubmit exercise data doorsturen naar addExercise() : toevoegen op gekozen index
          Verwijderen van oefening : item verwijderen uit ExArray op juiste index
          Sets toevoegen/aanpassen/verwijderen: zelfde principe*/}
        </div>
      )}
      {loading && (
        <img
          alt="loader"
          style={{ width: "30%", padding: "50px 0" }}
          src={Loader}
        />
      )}
      {currentWorkout.exercises !== null &&
        currentWorkout.exercises !== undefined && <p>Has exercises</p>}
    </div>
  );
};
