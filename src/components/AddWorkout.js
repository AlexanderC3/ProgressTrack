import React, { useState } from "react";
import { storage } from "../firebase/config";
import { useForm } from "react-hook-form";
import { createPersonalWorkout } from "../firebase/functions";
import { Modal } from "./Modal";
import { useSession } from "../firebase/UserProvider";

export const AddWorkout = () => {
  const [file, setFile] = React.useState(null);
  const { register, handleSubmit } = useForm();
  const [hideModal, setHideModal] = useState(true);
  const { user } = useSession();

  const onFileChange = async (e) => {
    setFile(e.target.files[0]);
  };

  const removeFile = async () => {
    setFile(null);
  };

  const onSubmit = async (data) => {
    const workoutName = data.name;
    try {
      const workoutData = {};
      workoutData.name = workoutName;

      if (file !== null) {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        workoutData.img = fileUrl;
      }

      await createPersonalWorkout(workoutData, user.uid);
    } catch (error) {
      console.log(error);
    }
    resetForm();
  };

  const resetForm = () => {
    setHideModal(true);
  };

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
