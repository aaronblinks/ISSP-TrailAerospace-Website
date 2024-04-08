import { useState, useEffect } from 'react';
import "./App.css";
import LineChart from "./components/LineChart";
import { listObjects, getObjectText } from "./csvFromBucketHandler";

function findHighestValues(data) {
  const highestValues = {};
  data.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (!(key in highestValues) || obj[key] > highestValues[key]) {
        highestValues[key] = obj[key];
      }
    });
  });
  return highestValues;
}

const chartsInfo = [
  { key: 'altitude', label: 'Flight Data Altitude' },
  { key: 'xaccel', label: 'Flight Data X Acceleration' },
  { key: 'yaccel', label: 'Flight Data Y Acceleration' },
  { key: 'zaccel', label: 'Flight Data Z Acceleration' },
  { key: 'elevator', label: 'Flight Data Elevator' },
  { key: 'aileron', label: 'Flight Data Aileron' },
  { key: 'rudder', label: 'Flight Data Rudder' }
];

const parseData = (csvData) => {
  const lines = csvData.trim().split('\n');
  const headers = lines.shift().split(',');
  let flightDuration = null;
  let reward = null;

  const flightData = lines.reduce((accumulator, line, index) => {
    if (index < 1 || index % 2000 === 0) {
      const values = line.split(',');
      const flightEntry = {};
      headers.forEach((header, i) => {
        if (header === 'altitude' || header === 'xaccel' || header === 'yaccel' || header === 'zaccel' || header === 'elevator' || header === 'aileron' || header === 'rudder' || !chartsInfo.find(info => info.key === header)) {
          flightEntry[header] = parseFloat(values[i]);
        }
          else if (header === 'Flight Duration') {
          flightDuration = parseFloat(values[i]);
        } else if (header === 'Reward') {
          reward = parseFloat(values[i]);
        }
      });
      flightEntry.time = index + 1;
      accumulator.push(flightEntry);
    }
    return accumulator;
  }, []);

  flightData.forEach(entry => {
    entry['Flight Duration'] = flightDuration;
    entry['Reward'] = reward;
  });

  return flightData;
};

function App() {
  const [objectList, setObjectList] = useState([]);
  const [objectText, setObjectText] = useState('');
  const [chartData, setChartData] = useState({});
  const [objectData, setObjectData] = useState(null);
  const [UserData, setUserData] = useState([]);
  const [currentlySelectedFile, setCurrentlySelectedFile] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const objects = await listObjects();
        setObjectList(objects);
      } catch (error) {
        console.error("Error fetching S3 data:", error);
      }
    }

    fetchData();
  }, []);

  const fetchObjectText = async (objectKey) => {
    try {
      const text = await getObjectText(objectKey);
      setObjectText(text);
      setCurrentlySelectedFile(objectKey);
      const parsedData = parseData(text);
      setUserData(parsedData);
    } catch (error) {
      console.error("Error fetching object text:", error);
    }
  };

  useEffect(() => {
    const initialChartData = chartsInfo.reduce((acc, { key, label }) => {
      acc[key] = {
        labels: UserData.map(data => data.time),
        datasets: [{
          label,
          data: UserData.map(data => data[key]),
          backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"],
          borderColor: "black",
          borderWidth: 2,
        }]
      };
      return acc;
    }, {});
    setChartData(initialChartData);
  }, [UserData]);

  const highestValues = findHighestValues(UserData);
  delete highestValues['Flight Duration'];
  delete highestValues['Reward'];

  
  return (
    <div className="App">
      <nav className="navbar">
        <a href="#" className="nav-brand">Flight Data Dashboard</a>
        <div className="dropdown">
          <button className="dropbtn">Charts</button>
          <div className="dropdown-content">
            {objectList.map((objectKey, index) => (
              // Use a button directly instead of an additional button to fetch data
              <button key={index} onClick={() => fetchObjectText(objectKey)} className="dropdown-item">
                {objectKey}
              </button>
            ))}
          </div>
        </div>
      </nav>
  
      <div className="mainbar">
        <h1>Current file: {currentlySelectedFile}</h1>
        <div>
          {Object.entries(highestValues).map(([key, value]) => (
            <p key={key}>Max {key}: {value}{['elevator', 'aileron', 'rudder'].includes(key) ? '°' : ''}</p>
          ))}
        </div>
      </div>
  
      <div className="sidebar">
        {chartsInfo.map(({ key }) => chartData[key] && (
          <div key={key} style={{ width: 700 }}>
            <LineChart chartData={chartData[key]} />
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;
