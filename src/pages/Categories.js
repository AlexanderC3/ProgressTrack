import React, { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import { Link } from "react-router-dom";

const Categories = () => {
  const [exercises, setExcercises] = useState([]);

  useEffect(() => {
    const exercisesRef = firestore.collection("categories").orderBy("name");

    const unsubscribe = exercisesRef.onSnapshot((querySnapshot) => {
      const exercisesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExcercises(exercisesList);
    });
    return unsubscribe;
  }, []);

  const toLowercase = (string) => {
    return string.toLowerCase();
  };

  return (
    <div style={{ marginTop: "6em" }}>
      <div className="row" style={{ width: "85%", margin: "0 auto" }}>
        {exercises
          ? exercises.map((item, index) => {
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
                      pathname: `/exercises/${toLowercase(item.name)}`,
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
                      <div className="catInfo">
                        <h4 className="muscleHeader">Target muscles</h4>
                        {item.muscles
                          ? item.muscles.map((muscle, index) => {
                              return (
                                <div key={index}>
                                  <span>{muscle}</span>
                                </div>
                              );
                            })
                          : ""}
                      </div>
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

export default Categories;
