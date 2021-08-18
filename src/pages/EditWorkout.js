import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
//import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";

export const EditWorkout = () => {
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const { user } = useSession();
  const params = useParams();
  const workout = params.workout;

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

      setCurrentWorkout(workoutToEdit);
    });
    return unsubscribe;
  }, [user.uid, workout]);

  return <div style={{ marginTop: "3em" }}>{workout}</div>;
};
