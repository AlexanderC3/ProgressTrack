import React from "react";

export const Modal = ({ hideModal, toggleModal, children }) => {
  if (hideModal) return null;

  return [
    <div
      key="overlay"
      className="modalOverlay"
      onClick={() => toggleModal()}
    />,
    <div key="form" className="modal">
      {children}
    </div>,
  ];
};
