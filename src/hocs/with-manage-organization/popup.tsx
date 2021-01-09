import React, { FunctionComponent, useState } from "react";
import { ManageOrganizationPopupProvider } from "../../context/manage-organization-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../containers/manage-organization/detail/edit-form";

const WithManageOrganizationPopup: FunctionComponent<{}> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDetailEditOpen, setDetailEditOpen] = useState(false);
  const [isClubListOpen, setClubListOpen] = useState(false);
  const [isPlayerListOpen, setPlayerListOpen] = useState(false);
  const [isPowerShareOpen, setPowerShareOpen] = useState(false);
  function openDetailEdit() {
    setDetailEditOpen(true);
    setOpen(true);
  }
  function openClubList() {
    setClubListOpen(true);
    setOpen(true);
  }
  function openPlayerList() {
    setPlayerListOpen(true);
    setOpen(true);
  }
  function openPowerShare() {
    setPowerShareOpen(true);
    setOpen(true);
  }

  function close() {
    setDetailEditOpen(false);
    setClubListOpen(false);
    setPlayerListOpen(false);
    setPowerShareOpen(false);
    setOpen(false);
  }

  return (
    <ManageOrganizationPopupProvider
      value={{
        isOpen,
        openDetailEdit,
        openClubList,
        openPlayerList,
        openPowerShare,
        close,
      }}
    >
      {children}
      <Modal show={isOpen} onHide={() => close()}>
        <Modal.Body>{isDetailEditOpen && <EditForm />}</Modal.Body>
      </Modal>
    </ManageOrganizationPopupProvider>
  );
};

export { WithManageOrganizationPopup };
