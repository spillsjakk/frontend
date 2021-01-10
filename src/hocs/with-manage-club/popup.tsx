import React, { FunctionComponent, useState } from "react";
import { ManageClubPopupProvider } from "../../context/manage-club-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../containers/manage-club/detail/edit-form";
import { SharePowerDetail } from "../../containers/manage-club/detail/share-power";
import { useClub } from "../../context/club";
import { TeamsSummary } from "../../containers/manage-club/summary/teams";
import AllAccounts from "../../pages/Organization/AllAccounts";

const WithManageClubPopup: FunctionComponent<{}> = ({ children }) => {
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

  const club = useClub();

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
    <ManageClubPopupProvider
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

          {isClubListOpen && <TeamsSummary />}

          {isPowerShareOpen && <SharePowerDetail />}

          {isPlayerListOpen && club && (
            <AllAccounts
              {...({
                match: { params: { oid: club.id } },
                popup: true,
                forClubs: true,
              } as any)}
            />
          )}
        </Modal.Body>
      </Modal>
    </ManageClubPopupProvider>
  );
};

export { WithManageClubPopup };
