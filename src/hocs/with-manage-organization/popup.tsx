import React, { FunctionComponent, useState } from "react";
import { ManageOrganizationPopupProvider } from "../../context/manage-organization-popup";
import { Modal } from "react-bootstrap";
import { EditForm } from "../../containers/manage-organization/detail/edit-form";
import Statistics from "../../pages/Organization/Statistics";
import { useOrganization } from "../../context/organization";
import { ClubsSummary } from "../../containers/manage-organization/summary/clubs";
import { AccountsWithPowersModal } from "../../components/accounts-with-powers-modal";
import AllAccounts from "../../pages/Organization/AllAccounts";

const WithManageOrganizationPopup: FunctionComponent<{}> = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isDetailEditOpen, setDetailEditOpen] = useState(false);
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
    <ManageOrganizationPopupProvider
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
          {isAccountsWithPowersOpen && <AccountsWithPowersModal />}
        </Modal.Body>
      </Modal>
    </ManageOrganizationPopupProvider>
  );
};

export { WithManageOrganizationPopup };
