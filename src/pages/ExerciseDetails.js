import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useForm } from "react-hook-form";
import { addRegistration } from "../firebase/functions";
import { useSession } from "../firebase/UserProvider";

export const ExerciseDetail = (props) => {
  const [exerciseInfo, setExerciseInfo] = useState([]);
  const [totalSets, setTotalSets] = useState(0);
  const { register, handleSubmit } = useForm();
  const { cat, exercises } = props;
  const { user } = useSession();

  useEffect(() => {
    const catRef = firestore
      .collection("exercises")
      .doc(cat)
      .collection("catExercises")
      .where("name", "==", exercises);

    const unsubscribe = catRef.onSnapshot((querySnapshot) => {
      const exInfo = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExerciseInfo(exInfo[0]);
    });
    return unsubscribe;
  }, [cat, exercises]);

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

    for (let i = 0; i < repsArray.length; i++) {
      repsweightArray.push({
        totalReps: repsArray[i],
        weight: weightArray[i],
      });
    }

    try {
      var regData = {};
      regData.cat = cat;
      regData.exercise = exerciseInfo.id;
      regData.reps = repsweightArray;
      regData.date = new Date();
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
    </div>
  );
};
