import React, { FunctionComponent, useEffect, useState } from "react";
import { fetchCall } from "../../../../functions";
import { useClub } from "../../../../context/club";
import Translated from "../../../../components/translated";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const Stats: FunctionComponent<unknown> = () => {
  const [accounts, setAccounts] = useState([]);
  const [ageHistogram, setAgeHistogram] = useState([]);
  const { id, region } = useClub();
  function fetchAccounts() {
    fetchCall(`/s/club/all-accounts/${id}`, "GET", undefined, (response) => {
      setAccounts(response);
      const ageHistogram: { [age: string]: number } = {};
      for (const account of response) {
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
  }, []);
  return (
    <>
      <div className="m-5">
        <strong>
          <Translated str="region" />:
        </strong>
        &nbsp;{region}
        <br />
        <strong>
          <Translated str="age" />:
        </strong>
        <BarChart width={750} height={350} data={ageHistogram}>
          <XAxis dataKey="age" />
          <YAxis />
          <Bar dataKey="count" fill={"darkblue"} />
        </BarChart>
      </div>
    </>
  );
};

export { Stats };
