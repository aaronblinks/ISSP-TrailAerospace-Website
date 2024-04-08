import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import 'chartjs-plugin-zoom';

function LineChart({ chartData }) {
  return <Line data={chartData} options={chartData.options} />;
}

export default LineChart;
