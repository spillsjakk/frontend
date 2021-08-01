import React, { FunctionComponent, useState } from "react";
import { useUser } from "../../components/UserContext";
import Translated from "../../components/translated/index";
import { fetchJson } from "../../functions";
import UserLink from "../../components/UserLink";
import { Search } from "@material-ui/icons";

const SearchByFideId: FunctionComponent<{}> = () => {
  const [fideId, setFideId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [player, setPlayer] = useState<any>();

  const { user } = useUser();

  function onSearch(e: any) {
    e.preventDefault();
    setPlayer(undefined);
    setNotFound(false);
    fetchJson(`/s/account/fideid/${fideId}`, "GET", undefined, (json: any) => {
      if (json.success) {
        setPlayer(json.account);
      } else {
        setNotFound(true);
      }
    });
  }

  return (
    <>
      {user?.authenticated && (
        <>
          <div className="header">
            {Translated.byKey("searchByFideId").toUpperCase()}
          </div>
          <form id="search-by-fide-id" onSubmit={onSearch}>
            <div className="wrapper">
              <input
                name="q"
                value={fideId}
                type="search"
                onChange={(e) => setFideId(e.target.value)}
              />
              <button type="submit" className="btn">
                <Search />
              </button>
            </div>
          </form>
        </>
      )}
      {notFound && (
        <div className="box">
          <span>{Translated.byKey("notFound")}</span>
        </div>
      )}
      {player && (
        <>
          <div className="box">
            <UserLink
              id={player.id}
              name={player.first_name + " " + player.last_name}
              ghost={false}
            />
          </div>
        </>
      )}
    </>
  );
};

export { SearchByFideId };
