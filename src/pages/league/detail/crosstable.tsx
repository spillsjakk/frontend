import React, { FunctionComponent, useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { fetchJson } from "../../../functions";
import { Participant } from "../../Tournament/Types";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import FederationDisplay from "../../../components/FederationDisplay";

type Categories = Array<{ participants: Array<Participant> }>;

const CrossTable: FunctionComponent<{ seasonId: string; leagueId: string }> = (
  props
) => {
  const [data, setData] = useState<Categories>([]);

  useEffect(() => {
    fetchJson(
      `/s/leagues/${props.leagueId}/seasons/${props.seasonId}/results`,
      "GET",
      undefined,
      (response: Categories) => {
        if (Array.isArray(response)) {
          console.log("response", response);
          response = response.map((category) => ({
            ...category,
            participants: category.participants.map((p) => ({
              ...p,
              id: p.account,
            })),
          }));
          setData(response);
        }
      }
    );
  }, []);

  function getUsername(params) {
    return `${params.getValue(params.id, "first_name")} ${params.getValue(
      params.id,
      "last_name"
    )}`;
  }

  function renderPlayerCell(params) {
    const participantLink = (
      <div className="text-truncate">
        <Link to={"/profile/" + params.id}>{getUsername(params)}</Link>
      </div>
    );
    const titleSpan = params.getValue(params.id, "title") ? (
      <div className={style["player-title"]}>
        {params.getValue(params.id, "title")}
      </div>
    ) : (
      <></>
    );
    const cell = (
      <div
        className="d-flex"
        style={{ lineHeight: "normal", maxWidth: "100%" }}
      >
        {titleSpan} {participantLink}
      </div>
    );
    if (params.getValue(params.id, "eliminated")) {
      return <s>{cell}</s>;
    } else {
      return cell;
    }
  }

  function renderFederationCell(params) {
    return <FederationDisplay value={params.row.federation} />;
  }

  const columns: GridColDef[] = [
    {
      field: "rank",
      headerName: "Rank",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "name",
      headerName: "Name",
      hideSortIcons: true,
      headerAlign: "center",
      width: 180,
      renderCell: renderPlayerCell,
      valueGetter: getUsername,
    },
    {
      field: "federation",
      headerName: "Federation",
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
      renderCell: renderFederationCell,
    },
  ];

  return (
    <div style={{ minWidth: "1200px" }}>
      {Array.isArray(data) &&
        data.map((categoryData, i) => (
          <DataGrid
            key={i}
            autoHeight
            rows={categoryData.participants || []}
            columns={columns}
          />
        ))}
    </div>
  );
};

export { CrossTable };
