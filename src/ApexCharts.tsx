import { ChangeEvent, useEffect, useState } from "react";

import Chart from "react-apexcharts";

import axios from "axios";

export const ApexCharts = () => {
  const [intervalData, setIntervalData] = useState("1h");
  const limit = 20; //max 100
  const initialCandlesData = Array.from({ length: limit }, () => Array.from({ length: 5 }, () => 0));
  const [candlesData, setCandlesData] = useState(initialCandlesData);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  type CandleType = {
    0: number;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: number;
    7: string;
    8: number;
    9: string;
    10: string;
    11: string;
  };

  useEffect(() => {
    const fetchDataChart = async () => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/klines", {
          params: {
            symbol: "BTCUSDT",
            interval: intervalData,
            limit: limit,
          },
        });

        const newCandleData = response.data.map((candle: CandleType) => [
          candle[0],
          parseFloat(candle[1]),
          parseFloat(candle[2]),
          parseFloat(candle[3]),
          parseFloat(candle[4]),
        ]);

        setCandlesData(newCandleData);
      } catch (error) {
        console.error("Error fetching candle data:", error);
      }
    };
    fetchDataChart();

    // const intervalId = setInterval(fetchDataChart, 10 * 1000) // 10s
    // return () => clearInterval(intervalId)
  }, [intervalData]);

  const randomBought = getRandomInt(0, limit / 2);
  const randomSold = getRandomInt(limit / 2, limit - 1);

  const options = {
    annotations: {
      points: [
        {
          x: candlesData[randomBought][0],
          y: candlesData[randomBought][3],

          marker: {
            size: 8,
            fillColor: "#0000ff",
            strokeColor: "#fff",
            strokeWidth: 2,
          },

          label: {
            borderColor: "#0000ff",
            style: {
              color: "#fff",
              background: "#0000ff",
            },
            text: "Bought",
          },
        },
        {
          x: candlesData[randomSold][0],
          y: candlesData[randomSold][2],

          marker: {
            size: 8,
            fillColor: "#0000ff",
            strokeColor: "#fff",
            strokeWidth: 2,
          },
          label: {
            borderColor: "#0000ff",
            style: {
              color: "#fff",
              background: "#0000ff",
            },
            text: "Sold",
          },
        },
      ],
    },
  };
  const series = [
    {
      data: candlesData,
      // data: [
      //   [1712156400000, 6593.34, 6600, 6582.63, 6600],
      //   [1712157400000, 6595.16, 6604.76, 6590.73, 6593.86],
      // ],
    },
  ];

  const handleIntervalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIntervalData(e.currentTarget.value);
  };

  return (
    <div className={"app"}>
      <div className="row">
        <h3>BTC/USDT</h3>
        <label htmlFor="periodSelect">Select Interval:</label>
        <select id="periodSelect" value={intervalData} onChange={handleIntervalChange}>
          <option value="1m">1 Minute</option>
          <option value="5m">5 Minutes</option>
          <option value="15m">15 Minutes</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
        </select>

        <div className="mixed-chart">
          <Chart options={options} series={series} type="candlestick" />
        </div>
      </div>
    </div>
  );
};
