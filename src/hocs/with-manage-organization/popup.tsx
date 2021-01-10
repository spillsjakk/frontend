import React, { FunctionComponent, useState } from "react";
import { ManageOrganizationPopupProvider } from "../../context/manage-organization-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../containers/manage-organization/detail/edit-form";
import { SharePowerDetail } from "../../containers/manage-organization/detail/share-power";
import Statistics from "../../pages/Organization/Statistics";
import { useOrganization } from "../../context/organization";
import { ClubsSummary } from "../../containers/manage-organization/summary/clubs";
import AllAccounts from "../../pages/Organization/AllAccounts";

const WithManageOrganizationPopup: FunctionComponent<{}> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDetailEditOpen, setDetailEditOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isClubListOpen, setClubListOpen] = useState(false);
  const [isPlayerListOpen, setPlayerListOpen] = useState(false);
  const [isPowerShareOpen, setPowerShareOpen] = useState(false);

  function getModalSize() {
    if (isPlayerListOpen) {
      return "xl";
    }
    return "md";
  }

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
      <Modal show={isOpen} onHide={() => close()} size={getModalSize() as any}>
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
          {isClubListOpen && <ClubsSummary />}
          {isPlayerListOpen && organization && (
            <AllAccounts
              {...({
                match: { params: { oid: organization.id } },
                popup: true,
              } as any)}
            />
          )}
          {isPowerShareOpen && <SharePowerDetail />}
        </Modal.Body>
      </Modal>
    </ManageOrganizationPopupProvider>
  );
};

export { WithManageOrganizationPopup };
