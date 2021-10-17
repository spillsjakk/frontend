import React, { FunctionComponent, useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { fetchJson } from "../../../functions";

const CrossTable: FunctionComponent<{ seasonId: string; leagueId: string }> = (
  props
) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchJson(
      `/s/leagues/${props.leagueId}/seasons/${props.seasonId}/results`,
      "GET",
      undefined,
      (response) => {
        if (Array.isArray(response)) {
          console.log("response", response);
          setData(response);
        }
      }
    );
  }, []);

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
      width: 180,
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
    <div style={{ minWidth: "1200px" }}>
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  );
};

export { CrossTable };
