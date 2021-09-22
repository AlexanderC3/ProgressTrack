import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { Link } from "react-router-dom";
import { AddWorkout } from "../components/AddWorkout";
import { useSession } from "../firebase/UserProvider";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const { user } = useSession();

  useEffect(() => {
    // er zijn 2 soorten workouts: default workouts en eigen workouts
    const basicWorkoutsRef = firestore.collection("workouts").orderBy("name");
    const personalWorkoutsRef = firestore
      .collection("users")
      .doc(user.uid)
      .collection("workouts")
      .orderBy("name");

    const unsubscribe = basicWorkoutsRef.onSnapshot((querySnapshot) => {
      const basicWorkoutsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      personalWorkoutsRef.onSnapshot((querySnapshot) => {
        const personalWorkoutsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (personalWorkoutsList.length > 0) {
          //wanneer er eigen workouts zijn, worden deze toegevoegd aan de workouts variabele
          setWorkouts(basicWorkoutsList.concat(personalWorkoutsList));
        } else {
          setWorkouts(basicWorkoutsList);
        }
      });
    });
    return unsubscribe;
  }, [user.uid]);

  return (
    <div style={{ marginTop: "6em", minHeight: "70vh" }}>
      {/* Toevoegen van de + new workout knop die geïmplementeerd wordt in AddWorkout.js */}
      <AddWorkout />
      <div
        className="row workoutsRow"
        style={{ width: "85%", margin: "0 auto" }}
      >
        {workouts
          ? workouts.map((item, index) => {
              return (
                <div
                  key={index}
                  className="col-lg-4 col-sm-6"
                  style={{
                    padding: "15px",
                    borderRadius: "15px",
                  }}
                >
                  <Link
                    to={{
                      pathname: `/workouts/${item.name}`,
                    }}
                  >
                    <div
                      className="catCard"
                      style={{
                        position: "relative",
                        borderRadius: "15px",
                        overflow: "hidden",
                        objectFit: "cover",
                        height: "100%",
                      }}
                    >
                      <h3 className="catHeader2">{item.name}</h3>
                      {/* Wanneer er een afbeelding meegegeven werd, wordt deze weergegeven anders wordt een default afbeelding gebruikt. */}
                      <img
                        src={
                          item.img
                            ? item.img
                            : "https://firebasestorage.googleapis.com/v0/b/progresstrack-887cb.appspot.com/o/workoutDefault.png?alt=media&token=f14f722f-f4c0-4903-9ceb-cd4628994dd6"
                        }
                        style={{
                          width: "100%",
                          borderRadius: "15px",
                          opacity: ".9",
                          minHeight: "calc(13.5em + 4vw)",
                          maxHeight: "300px",
                          objectFit: "cover",
                        }}
                        alt={item.name}
                        className="catImg"
                      />
                    </div>
                  </Link>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default Workouts;
