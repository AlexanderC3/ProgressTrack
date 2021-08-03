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

  const onSubmit = async (data) => {
    const workoutName = data.name;
    try {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      await fileRef.put(file);
      const fileUrl = await fileRef.getDownloadURL();

      const workoutData = {};
      workoutData.name = workoutName;
      workoutData.img = fileUrl;
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
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  return (
    <div style={{ marginTop: "8em" }}>
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
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
