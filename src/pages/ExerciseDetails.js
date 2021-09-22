import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useForm } from "react-hook-form";
import { addRegistration } from "../firebase/functions";
import { useSession } from "../firebase/UserProvider";
import { useParams } from "react-router-dom";

export const ExerciseDetail = (props) => {
  const [exerciseInfo, setExerciseInfo] = useState([]);
  const [totalSets, setTotalSets] = useState(0);
  const { register, handleSubmit } = useForm();
  // Deze module wordt gebruikt binnen Exercises.js waardoor hier de properties cat(categorie) en exercise opgehaald kunnen worden uit de Exercises module.
  const { cat, exercise } = props;
  const { user } = useSession();
  const params = useParams();

  var catName = params.name;
  catName = catName.charAt(0).toUpperCase() + catName.slice(1);

  useEffect(() => {
    const catRef = firestore
      .collection("exercises")
      .where("name", "==", exercise);

    const unsubscribe = catRef.onSnapshot((querySnapshot) => {
      const exInfo = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExerciseInfo(exInfo[0]);
    });
    return unsubscribe;
  }, [cat, exercise]);

  const addSet = () => {
    setTotalSets(totalSets + 1);
  };

  const RemoveSet = () => {
    setTotalSets(totalSets - 1);
  };

  const onSubmit = async (data) => {
    var repsArray = [];
    var weightArray = [];
    var repsweightArray = [];

    //Het is niet gemakkelijk om meteen een gewicht aan een set te linken. Daardoor wordt hier de verschillende aantal sets overlopen en opgeslagen in de array repsArray.
    //Hetzelfde geldt voor de de verschillende gewicht waarden. (const [key, value] of Object.entries(data) met data de data opgehaald uit de form).
    //De eerste waarde die ingegeven werd zal ook nu de eerste index hebben in de array.

    for (const [key, value] of Object.entries(data)) {
      if (key.includes("totalReps")) {
        repsArray.push(Number(value));
      }
    }

    for (const [key, value] of Object.entries(data)) {
      if (key.includes("weight")) {
        weightArray.push(Number(value));
      }
    }

    //Nu worden de values aan elkaar gelinkt. Juiste gewicht bij juiste set en opgeslagen in de repsWeightArray array.

    for (let i = 0; i < repsArray.length; i++) {
      repsweightArray.push({
        totalReps: repsArray[i],
        weight: weightArray[i],
      });
    }

    try {
      var regData = {};
      regData.cat = cat;
      regData.catName = catName;
      regData.exercise = exerciseInfo.id;
      regData.exerciseName = exerciseInfo.name;
      regData.sets = repsweightArray;
      regData.date = new Date();
      console.log(regData);
      await addRegistration(regData, user.uid);
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload(false);
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      {exerciseInfo.img ? (
        <img
          src={exerciseInfo.img}
          style={{ width: "100%", maxWidth: "600px" }}
          alt={exerciseInfo.name}
        />
      ) : (
        ""
      )}
      <div
        style={{
          padding: "10px 5px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p className="formButton" onClick={() => addSet()}>
          Add set +
        </p>
        {totalSets > 0 ? (
          <p className="formButton" onClick={() => RemoveSet()}>
            Remove set -
          </p>
        ) : (
          ""
        )}
      </div>
      <form
        style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Afhankelijk van een aantal sets (totalsets variabele) wordt deze return meerdere keren weergegeven (totalsets aantal keren) => Array.from(Array(totalSets) ...)*/}
        {totalSets > 0
          ? Array.from(Array(totalSets), (e, i) => {
              return (
                <div key={i} style={{ marginBottom: "20px" }}>
                  Set {i + 1}
                  <div>
                    <input
                      className="formInput"
                      type="number"
                      placeholder="#reps"
                      min="0"
                      ref={register}
                      name={"totalReps" + (i + 1)}
                      required
                    />
                  </div>
                  <br />
                  <div>
                    <input
                      className="formInput"
                      type="number"
                      placeholder="Weight (kg)"
                      min="0"
                      ref={register}
                      name={"weight" + (i + 1)}
                      required
                    />
                  </div>
                </div>
              );
            })
          : ""}
        {totalSets > 0 ? <button type="submit">Submit</button> : ""}
      </form>
      <br />
    </div>
  );
};
