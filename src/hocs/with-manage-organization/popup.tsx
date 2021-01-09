import React, { FunctionComponent, useState } from "react";
import { ManageOrganizationPopupProvider } from "../../context/manage-organization-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../containers/manage-organization/detail/edit-form";
import Statistics from "../../pages/Organization/Statistics";
import { useOrganization } from "../../context/organization";

const WithManageOrganizationPopup: FunctionComponent<{}> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDetailEditOpen, setDetailEditOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isClubListOpen, setClubListOpen] = useState(false);
  const [isPlayerListOpen, setPlayerListOpen] = useState(false);
  const [isPowerShareOpen, setPowerShareOpen] = useState(false);

  const organization = useOrganization();

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
  function openStats() {
    setStatsOpen(true);
    setOpen(true);
  }

  function close() {
    setDetailEditOpen(false);
    setClubListOpen(false);
    setPlayerListOpen(false);
    setStatsOpen(false);
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
        openStats,
        close,
      }}
    >
      {children}
      <Modal show={isOpen} onHide={() => close()}>
        <Modal.Body>
          {isDetailEditOpen && <EditForm />}
          {isStatsOpen && organization && (
            <Statistics
              {...({
                match: { params: { oid: organization.id } },
                popup: true,
              } as any)}
            />
          )}
        </Modal.Body>
      </Modal>
    </ManageOrganizationPopupProvider>
  );
};

export { WithManageOrganizationPopup };
