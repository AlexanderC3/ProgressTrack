import React, { useEffect, useState } from "react";
import { firestore, storage } from "../firebase/config";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createCat } from "../firebase/functions";
import { Modal } from "../components/Modal";

// !Deze module wordt niet gebruikt, hiermee heb ik AddWorkout opgesteld -> het toevoegen van een afbeelding in de storage functie van firebase.
// Todo: uiteindelijk deze file verwijderen.

const AddImageToStorage = () => {
  const [exercises, setExcercises] = useState([]);
  const [fileUrl, setFileUrl] = React.useState(null);
  const { register, handleSubmit } = useForm();
  const [hideModal, setHideModal] = useState(true);

  useEffect(() => {
    const exercisesRef = firestore.collection("exercises").orderBy("name");

    const unsubscribe = exercisesRef.onSnapshot((querySnapshot) => {
      const exercisesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExcercises(exercisesList);
    });
    return unsubscribe;
  }, []);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const onSubmit = async (data) => {
    try {
      const catData = new Object();
      catData.name = data.name;
      catData.img = fileUrl;
      await createCat(catData);
    } catch (error) {
      console.log(error);
    }
    resetForm();
  };

  const resetForm = () => {
    setHideModal(true);
    setExcercises("");
  };

  const toggleModal = () => {
    setHideModal(!hideModal);
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  const toLowercase = (string) => {
    return string.toLowerCase();
  };

  return (
    <div style={{ marginTop: "8em" }}>
      <p onClick={() => toggleModal()} style={{ width: "25rem", margin: "0" }}>
        + categorie
      </p>
      <Modal {...configModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Categorie toevoegen</h2>
          <span className="exit" onClick={() => toggleModal()}>
            X
          </span>
          <input type="file" onChange={onFileChange} />
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            ref={register}
          />
          <button type="submit">Submit</button>
        </form>
      </Modal>
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

export default AddImageToStorage;
