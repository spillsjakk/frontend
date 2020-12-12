import React, { Component } from "react";
import { Helmet } from 'react-helmet';
import Translated from "../../components/translated";
import { title, fetchJson } from "../../functions";
import { RouteComponentProps } from "react-router-dom";
import { Account } from "../Tournament/Types";
import lodash from "lodash";
import { PieChart, Pie, Tooltip, Legend, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";

type StatisticsProps = {
  oid: string
};

type StatisticsState = {
  clubCount: number,
  playerCount: number
  regionInfo: RegionInfo[],
  ageHistogram: { age: number, count: number }[]
};

type RegionInfo = {
  name: string
  clubCount: number
  playerCount: number
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
      regionInfo: [],
      ageHistogram: []
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

          const ageHistogram: { [age: string]: number } = {};
          for (const account of accounts) {
            if (account.birth_date) {
              const age = Math.floor((new Date().getTime() - new Date(account.birth_date!).getTime()) / 1000 / 60 / 60 / 24 / 365).toString();
              if (Object.keys(ageHistogram).includes(age)) {
                ageHistogram[age]++;
              } else {
                ageHistogram[age] = 1;
              }
            }
          }
          const sortedAges = Object.keys(ageHistogram).map(Number).sort((a, b) => a - b);
          const minAge = sortedAges[0];
          const maxAge = sortedAges[sortedAges.length - 1];
          const ageHistogramRecharts = [];
          for (let a = minAge; a <= maxAge; a++) {
            ageHistogramRecharts.push({ age: a, count: ageHistogram[a] || 0 });
          }

          this.setState({
            clubCount,
            playerCount,
            regionInfo: Object.keys(regionInfo).map(k => { return { name: k, ...regionInfo[k] }; }).sort((a, b) => a.name < b.name ? -1 : 1),
            ageHistogram: ageHistogramRecharts
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
              <tr key={region.name}>
                <td>{region.name}</td>
                <td>{region.clubCount}</td>
                <td>{region.playerCount}</td>
                <td>{Math.round(region.ageInfo.total / region.ageInfo.count * 10) / 10 || ""}</td>
                <td>{Math.round(region.mfRatioInfo.males / (region.mfRatioInfo.total - region.mfRatioInfo.males) * 1000) / 1000 || ""}</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="d-inline-flex flex-row flex-wrap mt-4">
          <div className="m-5">
            <strong><Translated str="clubCount" />:</strong>
            <PieChart width={350} height={350}>
              <Pie data={this.state.regionInfo} dataKey="clubCount" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                {this.state.regionInfo.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="m-5">
            <strong><Translated str="playerCount" />:</strong>
            <PieChart width={350} height={350}>
              <Pie data={this.state.regionInfo} dataKey="playerCount" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                {this.state.regionInfo.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          <div className="m-5">
            <strong><Translated str="age" />:</strong>
            <BarChart width={750} height={350} data={this.state.ageHistogram}>
              <XAxis dataKey="age" />
              <YAxis />
              <Bar dataKey="count" fill={COLORS[0]} />
            </BarChart>
          </div>
        </div>
      </>
    );
  }
}

const COLORS: string[] = [
  "#fff1c9",
  "#f7b7a3",
  "#ea5f89",
  "#9b3192",
  "#57167e"
];

export default Statistics;