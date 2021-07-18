import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
//import { Link } from "react-router-dom";

const WorkoutDetails = () => {
  const [exercises, setExercises] = useState([]);
  const params = useParams();
  const workout = params.name;

  useEffect(() => {
    const workoutRef = firestore
      .collection("workouts")
      .where("name", "==", workout);

    const unsubscribe = workoutRef.onSnapshot((querySnapshot) => {
      const workoutExercises = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExercises(workoutExercises[0].exercises);
    });
    return unsubscribe;
  }, [workout]);

  return <div>{console.log(exercises)}</div>;
};

export default WorkoutDetails;
