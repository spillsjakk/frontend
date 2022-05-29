import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Translated from "../../../components/translated";
import { useAllTournaments } from "../../../hocs/with-all-tournaments";

const ListTournaments: FunctionComponent<unknown> = () => {
  const { tournaments } = useAllTournaments();
  const [pageSize, setPageSize] = React.useState<number>(15);

  function renderPlayerCell(params) {
    return (
      <div>
        <Link to={"/tournament/view/" + params.row.id}>{params.row.name}</Link>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: Translated.byKey("tournamentName"),
      renderCell: renderPlayerCell,
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "start_date",
      headerName: Translated.byKey("startDate"),
      hideSortIcons: true,
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      flex: 1,
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <DataGrid
        autoHeight
        pageSize={pageSize}
        onPageSizeChange={(pageSize: number) => {
          setPageSize(pageSize);
        }}
        rowsPerPageOptions={[15, 30, 50]}
        pagination
        rows={tournaments}
        columns={columns}
      />
    </div>
  );
};

export { ListTournaments };
