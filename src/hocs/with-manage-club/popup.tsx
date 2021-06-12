import React, { FunctionComponent, useState } from "react";
import { ManageClubPopupProvider } from "../../context/manage-club-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../pages/Club/manage/detail/edit-form";
import { Stats as ClubStats } from "../../pages/Club/manage/detail/stats";
import { useClub } from "../../context/club";
import { TeamsSummary } from "../../pages/Club/manage/summary/teams";
import AllAccounts from "../../pages/Organization/AllAccounts";
import { AccountsWithPowersModal } from "../../components/accounts-with-powers-modal";

const WithManageClubPopup: FunctionComponent<{}> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDetailEditOpen, setDetailEditOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isClubListOpen, setClubListOpen] = useState(false);
  const [isPlayerListOpen, setPlayerListOpen] = useState(false);
  const [isAccountsWithPowersOpen, setAccountsWithPowersOpen] = useState(false);

  function getModalSize() {
    if (isPlayerListOpen || isAccountsWithPowersOpen) {
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
  function openStats() {
    setStatsOpen(true);
    setOpen(true);
  }
  function openAccountsWithPowers() {
    setAccountsWithPowersOpen(true);
    setOpen(true);
  }

  function close() {
    setDetailEditOpen(false);
    setClubListOpen(false);
    setPlayerListOpen(false);
    setStatsOpen(false);
    setAccountsWithPowersOpen(false);
    setOpen(false);
  }

  return (
    <ManageClubPopupProvider
      value={{
        isOpen,
        openDetailEdit,
        openClubList,
        openPlayerList,
        openStats,
        openAccountsWithPowers,
        close,
      }}
    >
      {children}
      <Modal show={isOpen} onHide={() => close()} size={getModalSize() as any}>
        <Modal.Body>
          {isDetailEditOpen && <EditForm />}

          {isClubListOpen && <TeamsSummary />}

          {isPlayerListOpen && club && (
            <AllAccounts
              {...({
                match: { params: { oid: club.id } },
                popup: true,
                forClubs: true,
              } as any)}
            />
          )}
          {isAccountsWithPowersOpen && (
            <AccountsWithPowersModal forClub={true} />
          )}
          {isStatsOpen && <ClubStats id={club.id} region={club.region} />}
        </Modal.Body>
      </Modal>
    </ManageClubPopupProvider>
  );
};

export { WithManageClubPopup };
