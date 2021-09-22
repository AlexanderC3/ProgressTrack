import React, { useState } from "react";
import { storage } from "../firebase/config";
import { useForm } from "react-hook-form";
import { createPersonalWorkout } from "../firebase/functions";
import { Modal } from "./Modal";
import { useSession } from "../firebase/UserProvider";

export const AddWorkout = () => {
  const [file, setFile] = useState(null);
  const { register, handleSubmit } = useForm();
  const [hideModal, setHideModal] = useState(true);
  const { user } = useSession();

  //Wanneer een foto geüpload wordt, zal deze opgeslagen worden in de variabele "file". Deze functie wordt uitgevoerd op lijn 115.
  const onFileChange = async (e) => {
    setFile(e.target.files[0]);
  };

  //Deze functie zorgt ervoor dat de file variabele terug null is.
  const removeFile = async () => {
    setFile(null);
  };

  //Dit is de onsubmit en wordt dus uitgevoerd wanneer de submit knop van een form ingeklikt wordt.
  //De property data is een json van alle waarden die ingegeven werden in de form.
  const onSubmit = async (data) => {
    const workoutName = data.name;
    //De bedoeling van dit stuk is om de nieuwe workout toe te voegen in de database, dit gebeurt altijd met een try-catch.
    try {
      const workoutData = {};
      workoutData.name = workoutName;

      //Als een foto werd geüpload, zal deze hier toegevoegd worden aan de storage functie van firebase.
      //Al deze regels binnen het if statement zijn default code die nodig zijn voor het toevoegen van een afbeelding in firebase.
      if (file !== null) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        //Met de fileUrl kunnen we de link van de afbeelding toevoegen aan het workout object.
        const fileUrl = await fileRef.getDownloadURL();
        workoutData.img = fileUrl;
      }

      //createPersonalWorkout is een functie die zich bevindt in de functions.js file (map firebase binnenin src).
      await createPersonalWorkout(workoutData, user.uid);
    } catch (error) {
      console.log(error);
    }
    //resetForm ledigt het formulier.
    resetForm();
  };

  const resetForm = () => {
    setHideModal(true);
  };

  //toggleModal en configModal zijn functies die horen bij Modal.js: dit wordt gebruikt om een verkleind "scherm" te openen bij bijvoorbeeld het klikken op "+ new workout".
  const toggleModal = () => {
    setHideModal(!hideModal);
    setFile(null);
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  return (
    <div style={{ marginTop: "7em" }}>
      {/* onClick => wanneer er geklikt wordt op "+ new workout" zal de modal getoggled worden en dus weergegeven of niet weergegeven worden*/}
      <div onClick={() => toggleModal()} className="addWorkout">
        + New workout
      </div>
      <Modal {...configModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Workout toevoegen</h2>
          <span className="exit" onClick={() => toggleModal()}>
            X
          </span>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Workout name"
              required
              ref={register}
            />
          </div>
          <br />
          {/*Wanneer er een file geüpload is, zal deze weergegeven worden. Wanneer er nog geen afbeelding is zal de knop add image zichtbaar zijn */}
          {file !== null ? (
            <div>
              <p style={{ fontSize: "1.1em" }}>
                {file.name}{" "}
                <i
                  onClick={() => removeFile()}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  className="fas fa-trash-alt"
                ></i>
              </p>
              <img
                src={URL.createObjectURL(file)}
                alt="newWorkout"
                style={{ width: "70%", borderRadius: "25px" }}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="workoutImg">
                Add image
                <input
                  type="file"
                  id="workoutImg"
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
              </label>
            </div>
          )}
          <br />
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
