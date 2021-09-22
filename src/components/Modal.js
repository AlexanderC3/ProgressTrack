import React from "react";

//Deze module zorgt voor het minischerm dat geopent wordt bij het klikken op bepaalde buttons.

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
