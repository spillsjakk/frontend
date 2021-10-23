import React, { FunctionComponent, useState, useEffect, memo } from "react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { fetchJson } from "../../../functions";
import { Pairing, Participant, Tournament } from "../../Tournament/Types";
import { Link } from "react-router-dom";
import style from "./style.module.scss";
import FederationDisplay from "../../../components/FederationDisplay";
import { sortByRank } from "../../Tournament/detail";
import Translated from "../../../components/translated";

type Categories = Array<{
  participants: Array<Participant>;
  tournament: Tournament;
  pairings: Array<Pairing>;
}>;

const CategoryTable: FunctionComponent<{ category: any; columns: any }> = memo(
  (props) => {
    return (
      <>
        <Link
          className={style["tournament-name"]}
          to={`/tournament/view/${props.category.tournament.id}`}
        >
          {props.category.tournament.name}
        </Link>
        <DataGrid
          autoHeight
          rows={props.category.participants || []}
          columns={props.columns}
        />
      </>
    );
  }
);

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
          response = response.map((category) => {
            const participants = category.participants
              .sort(sortByRank)
              .map((p, i) => {
                const whitePairings = category.pairings.filter(
                  (pairing) => pairing.white === p.account
                );
                const blackPairings = category.pairings.filter(
                  (pairing) => pairing.black === p.account
                );
                const roundData = {};

                whitePairings.forEach((pairing) => {
                  const opponentIndex = category.participants.findIndex(
                    (p) => p.account === pairing.black
                  );
                  let outcome = "*";
                  if (pairing.outcome === -1) {
                    outcome = "0";
                  } else if (pairing.outcome === 1) {
                    outcome = "1";
                  } else if (pairing.outcome === 0) {
                    outcome = "½";
                  }
                  roundData[`round${pairing.round}`] = `${
                    opponentIndex + 1
                  }w${outcome}`;
                });
                blackPairings.forEach((pairing) => {
                  const opponentIndex = category.participants.findIndex(
                    (p) => p.account === pairing.white
                  );
                  let outcome = "1/2";
                  if (pairing.outcome === -1) {
                    outcome = "1";
                  } else if (pairing.outcome === 1) {
                    outcome = "0";
                  } else if (pairing.outcome === 0) {
                    outcome = "½";
                  }
                  roundData[`round${pairing.round}`] = `${
                    opponentIndex + 1
                  }b${outcome}`;
                });
                return {
                  ...p,
                  id: p.account,
                  rank: i + 1,
                  ...roundData,
                };
              });
            category.pairings.sort((a, b) => (a.round - b.round ? -1 : 1));
            return {
              ...category,
              participants,
            };
          });
          setData(response);
        }
      }
    );
  }, []);

  function getUsername(params) {
    return `${params.row.first_name} ${params.row.last_name}`;
  }

  function renderPlayerCell(params) {
    const participantLink = (
      <div className="text-truncate">
        <Link to={"/profile/" + params.id}>{getUsername(params)}</Link>
      </div>
    );
    const titleSpan = params.row.title ? (
      <div className={style["player-title"]}>{params.row.title}</div>
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
    if (params.row.eliminated) {
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
      headerName: Translated.byKey("rank"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "name",
      headerName: Translated.byKey("player"),
      hideSortIcons: true,
      width: 180,
      renderCell: renderPlayerCell,
      valueGetter: getUsername,
    },
    {
      field: "federation",
      headerName: Translated.byKey("federation"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
      renderCell: renderFederationCell,
    },
    {
      field: "fide_rating",
      headerName: Translated.byKey("rating"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "score",
      headerName: Translated.byKey("score"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
  ];

  const tbColumns = [
    {
      field: "tb1",
      headerName: Translated.byKey("TB1"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "tb2",
      headerName: Translated.byKey("TB2"),
      hide: true,
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "tb3",
      headerName: Translated.byKey("TB3"),
      hide: true,
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
    {
      field: "tb4",
      headerName: Translated.byKey("TB4"),
      hide: true,
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      width: 110,
    },
  ];
  return (
    <div>
      {Array.isArray(data) &&
        data.map((categoryData, i) => {
          const roundColumns = [];
          if (
            Array.isArray(categoryData.pairings) &&
            categoryData.pairings.length > 0
          ) {
            Array(categoryData.pairings[0].round)
              .fill(0)
              .forEach((_, j) => {
                roundColumns.push({
                  field: `round${j + 1}`,
                  headerName: `Round ${j + 1}`,
                  hideSortIcons: true,
                  align: "center",
                  headerAlign: "center",
                  width: 110,
                });
              });
          }
          const categoryColumns = [...columns, ...roundColumns, ...tbColumns];
          return (
            <div className={style["crosstable-category"]} key={i}>
              <CategoryTable
                category={categoryData}
                columns={categoryColumns}
              />
            </div>
          );
        })}
    </div>
  );
};

export { CrossTable };
