import React, { FunctionComponent, useEffect, useState } from "react";
import { fetchCall } from "../../../../functions";
import Translated from "../../../../components/translated";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS: string[] = ["#f7b7a3", "#ea5f89", "#9b3192", "#57167e"];

const Stats: FunctionComponent<{ id: string; region: string }> = ({
  id,
  region,
}) => {
  const [accounts, setAccounts] = useState([]);
  const [mfRatio, setMfRatio] = useState([
    { name: "M", value: 0 },
    { name: "F", value: 0 },
  ]);
  const [ageHistogram, setAgeHistogram] = useState([]);
  function fetchAccounts() {
    fetchCall(`/s/club/all-accounts/${id}`, "GET", undefined, (response) => {
      setAccounts(response);
      const ageHistogram: { [age: string]: number } = {};
      const mData = { name: "M", value: 0 };
      const fData = { name: "F", value: 0 };
      for (const account of response) {
        if (account.sex === "M") {
          mData.value += 1;
        } else if (account.sex === "F") {
          fData.value += 1;
        }
        if (account.birth_date) {
          const age = Math.floor(
            (new Date().getTime() - new Date(account.birth_date!).getTime()) /
              1000 /
              60 /
              60 /
              24 /
              365
          ).toString();
          if (Object.keys(ageHistogram).includes(age)) {
            ageHistogram[age]++;
          } else {
            ageHistogram[age] = 1;
          }
        }
      }
      setMfRatio([mData, fData]);
      const sortedAges = Object.keys(ageHistogram)
        .map(Number)
        .sort((a, b) => a - b);
      const minAge = sortedAges[0];
      const maxAge = sortedAges[sortedAges.length - 1];
      const ageHistogramRecharts = [];
      for (let a = minAge; a <= maxAge; a++) {
        ageHistogramRecharts.push({
          age: a,
          count: ageHistogram[a] || 0,
        });
      }
      setAgeHistogram(ageHistogramRecharts.filter((hist) => hist.age !== 0));
    });
  }
  useEffect(() => {
    if (id) {
      fetchAccounts();
    }
  }, [id, region]);
  return (
    <>
      <div className="m-5">
        <strong>
          <Translated str="region" />:
        </strong>
        &nbsp;{region}
        <br />
        {ageHistogram.length > 0 && (
          <>
            <strong>
              <Translated str="age" />:
            </strong>
            <BarChart width={400} height={350} data={ageHistogram}>
              <XAxis dataKey="age" />
              <YAxis />
              <Bar dataKey="count" fill={"darkblue"} />
              <Tooltip />
            </BarChart>
          </>
        )}
        <strong>
          <Translated str="mfRatio" />:
        </strong>
        <PieChart width={350} height={350}>
          <Pie
            data={mfRatio}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
          >
            {mfRatio.map((o, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </>
  );
};

export { Stats };
