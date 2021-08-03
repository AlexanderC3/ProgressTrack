import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { Link } from "react-router-dom";
import { AddWorkout } from "../components/AddWorkout";

const Workouts = () => {
  const [basicWorkouts, setBasicWorkouts] = useState([]);
  //const [personalWorkouts, setPersonalWorkouts] = useState([]);

  useEffect(() => {
    const basicWorkoutsRef = firestore.collection("workouts").orderBy("name");

    const unsubscribe = basicWorkoutsRef.onSnapshot((querySnapshot) => {
      const basicWorkoutsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBasicWorkouts(basicWorkoutsList);
    });
    return unsubscribe;
  }, []);

  return (
    <div style={{ marginTop: "6em" }}>
      <AddWorkout />
      <div className="row" style={{ width: "85%", margin: "0 auto" }}>
        {basicWorkouts
          ? basicWorkouts.map((item, index) => {
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
                        background:
                          "linear-gradient(145deg, #f53803 0%, #ff4e00 100%)",
                        overflow: "hidden",
                      }}
                    >
                      <h3 className="catHeader">{item.name}</h3>
                      <img
                        src={item.img}
                        style={{
                          width: "100%",
                          borderRadius: "15px",
                          opacity: ".9",
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
