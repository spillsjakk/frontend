import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/Translated";
import { title, fetchJson } from "../../functions";
import { RouteComponentProps } from "react-router-dom";
import { Account } from "../Tournament/Types";
import lodash from "lodash";

type StatisticsProps = {
  oid: string
};

type StatisticsState = {
  clubCount: number,
  playerCount: number
  regionInfo: [string, RegionInfo][]
};

type RegionInfo = {
  clubCount: number
  playerCount: number,
  ageInfo: {
    total: number
    count: number
  },
  mfRatioInfo: {
    males: number
    total: number
  }
}

type Club = {
  id: string
  name: string
  description: string
  manager: string
  country: string
  region: string
};

type ClubMember = {
  club_id: string
  account_id: string
};

class Statistics extends Component<RouteComponentProps<StatisticsProps>, StatisticsState> {
  constructor(props: RouteComponentProps<StatisticsProps>) {
    super(props);

    this.state = {
      clubCount: 0,
      playerCount: 0,
      regionInfo: []
    };
  }

  componentDidMount() {
    document.getElementsByTagName("body")[0].id = "Organization-Statistics";

    fetchJson(`/s/organization/all-accounts/${this.props.match.params.oid}`, "GET", undefined, (accounts: Account[]) => {
      fetchJson(`/s/organization/clubs/${this.props.match.params.oid}`, "GET", undefined, (clubs: Club[]) => {
        fetchJson(`/s/organization/club-members/${this.props.match.params.oid}`, "GET", undefined, (clubMembers: ClubMember[]) => {
          const clubCount = clubs.length;
          const playerCount = accounts.length;

          const regionInfo = lodash.mapValues(lodash.groupBy(clubs, c => c.region), r => {
            return {
              clubCount: r.length,
              playerCount: 0,
              ageInfo: { total: 0, count: 0 },
              mfRatioInfo: { males: 0, total: 0 }
            };
          });

          const clubDict: { [id: string]: Club } = clubs.reduce((a, x) => ({ ...a, [x.id]: x }), {});
          const accountDict: { [id: string]: Account } = accounts.reduce((a, x) => ({ ...a, [x.id]: x }), {});

          for (const member of clubMembers) {
            const club = clubDict[member.club_id];
            const account = accountDict[member.account_id];

            regionInfo[club.region].playerCount++;

            if (account.birth_date) {
              const age = (new Date().getTime() - new Date(account.birth_date!).getTime()) / 1000 / 60 / 60 / 24 / 365;
              regionInfo[club.region].ageInfo.total += age;
              regionInfo[club.region].ageInfo.count++;
            }

            if (account.sex) {
              if (account.sex === "M") {
                regionInfo[club.region].mfRatioInfo.males += 1;
              }
              regionInfo[club.region].mfRatioInfo.total += 1;
            }
          }

          const regionInfoArray = Object.entries(regionInfo);
          regionInfoArray.sort((a, b) => a[0] < b[0] ? -1 : 1);


          this.setState({
            clubCount,
            playerCount,
            regionInfo: regionInfoArray
          })
        });
      });
    });
  }

  render() {
    return (
      <>
        <Helmet>
          <title>{title("organizationStatistics")}</title>
        </Helmet>

        <table className="mt-5">
          <tbody>
            <tr>
              <td style={{ paddingRight: "65px" }}><Translated str="totalClubCount" /></td>
              <td>{this.state.clubCount}</td>
            </tr>
            <tr>
              <td><Translated str="totalPlayerCount" /></td>
              <td>{this.state.playerCount}</td>
            </tr>
          </tbody>
        </table>

        <table className="table mt-5">
          <thead>
            <tr>
              <th><Translated str="region" /></th>
              <th><Translated str="clubCount" /></th>
              <th><Translated str="playerCount" /></th>
              <th><Translated str="averageAge" /></th>
              <th><Translated str="mfRatio" /></th>
            </tr>
          </thead>
          <tbody>
            {this.state.regionInfo.map(region =>
              <tr key={region[0]}>
                <td>{region[0]}</td>
                <td>{region[1].clubCount}</td>
                <td>{region[1].playerCount}</td>
                <td>{Math.round(region[1].ageInfo.total / region[1].ageInfo.count * 10) / 10 || ""}</td>
                <td>{Math.round(region[1].mfRatioInfo.males / (region[1].mfRatioInfo.total - region[1].mfRatioInfo.males) * 1000) / 1000 || ""}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
}

export default Statistics;