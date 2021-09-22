import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { ExerciseDetail } from "./ExerciseDetails";

const Exercises = () => {
  const [catExercises, setCatExcercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [catId, setCatId] = useState("");
  const params = useParams();

  //Wanneer de exercises opgevraagd worden van de abs categorie zal dit de url zijn: ../exercises/abs met abs een variabele in de App.js file waarbij het path /exercises:name is.
  //Hierdoor kunnen we met useParams deze waarde opslaan. Dit betekent dat in dit geval de waarde van params gelijk is aan "abs".
  //! Het probleem is nu dat de categorieën in de database beginnen met een hoofdletter, wat opgelost wordt in de volgende regel.

  const id = params.name.charAt(0).toUpperCase() + params.name.slice(1);

  useEffect(() => {
    const catRef = firestore.collection("categories").where("name", "==", id);

    const unsubscribe = catRef.onSnapshot((querySnapshot) => {
      const cat = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const categoryId = cat[0].id;
      setCatId(cat[0].id);

      const exercisesRef = firestore
        .collection("exercises")
        .where("categoryId", "==", categoryId);

      exercisesRef.onSnapshot((querySnapshot) => {
        const exercisesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        exercisesList.sort((a, b) => (a.name > b.name ? 1 : -1));
        setCatExcercises(exercisesList);
      });
    });
    return unsubscribe;
  }, [id]);

  //Op basis van de geselecteerde value uit <Select> wordt deze value opgeslagen in de selectedExercise variabele (onChange attribatuut in de Select)
  const handleExerciseChange = (selection) => {
    if (!!selection) {
      setSelectedExercise(selection.label);
    } else {
      setSelectedExercise("");
    }
  };

  return (
    <div style={{ marginTop: "100px", minHeight: "500px" }}>
      <h2>{id}</h2>
      <div style={{ width: "95%", margin: "auto" }}>
        <Select
          placeholder="Select an exercise"
          className="col-xl-4 col-lg-6 col-md-8 col-sm-12 selectBox"
          options={catExercises.map((name, id) => ({
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
        {/* Als er een exercise geselecteerd is wordt nu de ExerciseDetail module geladen met properties catId en geselecteerde exercise */}
        {selectedExercise !== "" ? (
          <ExerciseDetail cat={catId} exercise={selectedExercise} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Exercises;
