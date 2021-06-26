import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { ExerciseDetail } from "./ExerciseDetails";

const Exercises = () => {
  const [exercises, setExcercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [catId, setCatId] = useState("");
  const params = useParams();

  var id = params.name;
  id = id.charAt(0).toUpperCase() + id.slice(1);

  useEffect(() => {
    const catRef = firestore.collection("exercises").where("name", "==", id);

    const unsubscribe = catRef.onSnapshot((querySnapshot) => {
      const cat = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCatId(cat[0].id);

      const exercisesRef = firestore
        .collection("exercises")
        .doc(cat[0].id)
        .collection("catExercises")
        .orderBy("name");

      exercisesRef.onSnapshot((querySnapshot) => {
        const exercisesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExcercises(exercisesList);
      });
    });
    return unsubscribe;
  }, [id]);

  const handleExerciseChange = (selection) => {
    if (!!selection) {
      setSelectedExercise(selection.label);
    } else {
      setSelectedExercise("");
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <h2>{id}</h2>
      <div style={{ width: "95%", margin: "auto" }}>
        <Select
          placeholder="Select an exercise"
          className="col-xl-4 col-lg-6 col-md-8 col-sm-12 selectBox"
          options={exercises.map((name, id) => ({
            value: name.id,
            label: name.name,
          }))}
          isClearable
          onChange={(selection) => handleExerciseChange(selection)}
          theme={(theme) => ({
            ...theme,
            borderRadius: 5,
            colors: {
              ...theme.colors,
              primary25: "#9a424271",
              primary: "#612929ed",
            },
          })}
        />
        {selectedExercise !== "" ? (
          <ExerciseDetail cat={catId} exercises={selectedExercise} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Exercises;