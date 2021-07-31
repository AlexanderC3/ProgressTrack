import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useParams, useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { isMobile } from "react-device-detect";
import Loader from "../components/Images/loader.gif";
import { useForm } from "react-hook-form";
import { addRegistration } from "../firebase/functions";
import { useSession } from "../firebase/UserProvider";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper/core";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const WorkoutDetails = () => {
  const [exercises, setExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const params = useParams();
  const workout = params.name;
  const [swiperRef, setSwiperRef] = useState(null);
  var slidesPerPage = 3;
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit } = useForm();
  const { user } = useSession();
  const history = useHistory();

  useEffect(() => {
    const workoutRef = firestore
      .collection("workouts")
      .where("name", "==", workout);

    const unsubscribe = workoutRef.onSnapshot((querySnapshot) => {
      const workoutExercises = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const exercisesRef = firestore.collection("exercises");

      exercisesRef.onSnapshot((querySnapshot) => {
        const exercisesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllExercises(exercisesList);

        for (let i = 0; i < workoutExercises[0].exercises.length; i++) {
          for (let j = 0; j < exercisesList.length; j++) {
            if (
              workoutExercises[0].exercises[i].exerciseId ===
              exercisesList[j].id
            ) {
              workoutExercises[0].exercises[i].img = exercisesList[j].img;
              workoutExercises[0].exercises[i].name = exercisesList[j].name;
              workoutExercises[0].exercises[i].cat =
                exercisesList[j].categoryId;
            }
          }
        }
        setExercises(workoutExercises[0].exercises);
      });
    });
    return unsubscribe;
  }, [workout]);

  if (isMobile) {
    slidesPerPage = 1;
  }

  const nextItem = () => {
    swiperRef.slideNext();
  };

  const prevItem = () => {
    swiperRef.slidePrev();
  };

  setTimeout(() => {
    setLoading(false);
  }, 700);

  const onSubmit = async (data) => {
    var repsArray = [];
    var weightArray = [];
    var idArray = [];
    var repsweightArray = [];

    for (const [key, value] of Object.entries(data)) {
      if (key.includes("sets")) {
        repsArray.push(Number(value));
      }
    }

    for (const [key, value] of Object.entries(data)) {
      if (key.includes("weight")) {
        weightArray.push(Number(value));
      }
    }

    for (const [key, value] of Object.entries(data)) {
      if (key.includes("id")) {
        idArray.push(value);
      }
    }

    const uniqueValues = (ex) => {
      return [...new Set(ex)];
    };

    const uniqueIds = uniqueValues(idArray);

    for (let i = 0; i < repsArray.length; i++) {
      repsweightArray.push({
        totalReps: repsArray[i],
        weight: weightArray[i],
        id: idArray[i],
      });
    }

    var exercisesArray = [];
    for (let i = 0; i < exercises.length; i++) {
      var exInfo = allExercises.filter(function (item) {
        return item.id === uniqueIds[i];
      });
      exercisesArray.push({
        exercise: uniqueIds[i],
        exerciseName: exInfo[0].name,
        cat: exInfo[0].categoryId,
        date: new Date(),
        sets: repsweightArray.filter((x) => x.id === uniqueIds[i]),
      });
    }

    for (let i = 0; i < exercisesArray.length; i++) {
      for (let j = 0; j < exercisesArray[i].sets.length; j++) {
        exercisesArray[i].sets[j] = {
          totalReps: exercisesArray[i].sets[j].totalReps,
          weight: exercisesArray[i].sets[j].weight,
        };
      }
    }

    try {
      for (let i = 0; i < exercisesArray.length; i++) {
        await addRegistration(exercisesArray[i], user.uid);
      }
    } catch (error) {
      console.log(error);
    } finally {
      history.goBack();
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <h3 style={{ marginTop: "1.5em" }}>Workout: {workout}</h3>
      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Swiper
            allowTouchMove={isMobile}
            fadeEffect={true}
            onSwiper={setSwiperRef}
            slidesPerView={slidesPerPage}
            centeredSlides={true}
            spaceBetween={200}
            pagination={{
              type: "progressbar",
            }}
            navigation={true}
            className="mySwiper"
          >
            {exercises
              ? exercises.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <br />
                      <div>
                        Exercise {index + 1} / {exercises.length}
                      </div>
                      <div>
                        <p>{item.name}</p>
                      </div>
                      <div>
                        {" "}
                        <img
                          src={item.img}
                          style={{
                            height: "300px",
                            width: "450px",
                          }}
                          alt={item.name}
                        />
                      </div>
                      <div>
                        {item.sets
                          ? Array.from(Array(item.sets.length), (e, i) => {
                              return (
                                <div key={i} style={{ marginBottom: "20px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "1.1em",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Set {i + 1} :
                                    </span>
                                    <input
                                      style={{
                                        fontSize: "1.1em",
                                        fontWeight: "bold",
                                        border: "none",
                                        pointerEvents: "none",
                                        textAlign: "center",
                                        width: "2em",
                                      }}
                                      type="text"
                                      readOnly={true}
                                      value={item.sets[i]}
                                      ref={register}
                                      name={"sets" + (index + 1) + (i + 1)}
                                    />
                                    <span
                                      style={{
                                        fontSize: "1.1em",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {" "}
                                      reps
                                    </span>
                                  </div>
                                  <div>
                                    <input
                                      className="formInput"
                                      type="number"
                                      placeholder="Weight (kg)"
                                      min="0"
                                      name={"weight" + (index + 1) + (i + 1)}
                                      required
                                      readOnly={false}
                                      ref={register}
                                    />
                                  </div>
                                  <div>
                                    <input
                                      style={{ display: "none" }}
                                      type="text"
                                      value={item.exerciseId}
                                      name={"id" + (index + 1) + (i + 1)}
                                      readOnly
                                      ref={register}
                                    />
                                  </div>
                                  <br />
                                </div>
                              );
                            })
                          : ""}
                      </div>
                      <br />
                      <br />
                    </SwiperSlide>
                  );
                })
              : ""}
          </Swiper>
          <button type="submit">Submit</button>
        </form>
      )}
      {loading && (
        <img
          alt="loader"
          style={{ width: "30%", padding: "50px 0" }}
          src={Loader}
        />
      )}
      {!loading && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "10%",
            zIndex: "50",
          }}
        >
          <button className="nextExercise" onClick={() => prevItem()}>
            Prev exercise
          </button>
          <button className="nextExercise" onClick={() => nextItem()}>
            Next exercise
          </button>
        </div>
      )}
      {loading && <div></div>}
    </div>
  );
};

export default WorkoutDetails;
