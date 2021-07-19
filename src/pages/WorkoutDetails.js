import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { isMobile } from "react-device-detect";

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
  const params = useParams();
  const workout = params.name;
  const [swiperRef, setSwiperRef] = useState(null);
  var slidesPerPage = 3;

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

        for (let i = 0; i < workoutExercises[0].exercises.length; i++) {
          for (let j = 0; j < exercisesList.length; j++) {
            if (
              workoutExercises[0].exercises[i].exerciseId ===
              exercisesList[j].id
            ) {
              workoutExercises[0].exercises[i].img = exercisesList[j].img;
              workoutExercises[0].exercises[i].name = exercisesList[j].name;
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

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <h3 style={{ marginTop: "4em" }}>Workout: {workout}</h3>
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
                              <b style={{ fontSize: "1.1em" }}>
                                Set {i + 1}: {item.sets[i]} reps
                              </b>
                              <div>
                                <input
                                  className="formInput"
                                  type="number"
                                  placeholder="Weight (kg)"
                                  min="0"
                                  name={"weight" + (i + 1)}
                                  required
                                  readOnly={false}
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
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "30px",
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
    </div>
  );
};

export default WorkoutDetails;
