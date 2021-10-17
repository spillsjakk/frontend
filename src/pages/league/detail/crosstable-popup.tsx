import { Button } from "@material-ui/core";
import React, { FunctionComponent, memo, useState } from "react";
import { usePopup, WithPopup } from "../../../hocs/popup/index";
import { DataGrid, GridColDef } from "@material-ui/data-grid";

const CrossTable: FunctionComponent<unknown> = () => {
  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "RK.",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 80,
    },
    {
      field: " ",
      headerName: " ",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "name",
      headerName: "Name",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "federation",
      headerName: "FED",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "round1",
      headerName: "Round1",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "round2",
      headerName: "Round2",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "round3",
      headerName: "Round3",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
  ];
  const rows = [
    { id: 1, rank: 1, name: "Teo1", federation: "RUS" },
    { id: 2, rank: 2, name: "Teo2", federation: "POL" },
    { id: 3, rank: 3, name: "Teo3", federation: "CRO" },
    { id: 4, rank: 4, name: "Teo4", federation: "NED" },
    { id: 5, rank: 5, name: "Teo5", federation: "FRA" },
  ];

  return (
    <div>
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  );
};

export { CrossTable };

const CrossTableButton: FunctionComponent<unknown> = memo(() => {
  const popup = usePopup();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        popup.changeOpen(true);
      }}
    >
      cross table
    </Button>
  );
});

export { CrossTableButton };

const CrossTablePopup: FunctionComponent<{}> = () => {
  return (
    <div>
      <WithPopup content={<CrossTable />}>
        <CrossTableButton />
      </WithPopup>
    </div>
  );
};

export { CrossTablePopup };
