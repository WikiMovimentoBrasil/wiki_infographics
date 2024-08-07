import { useState, useEffect } from 'react';
import api from '../api/axios';

import NavBar from '../Components/NavBar/navBar';
import CodeEditor from '../Components/CodeEditor/codeEditor';
import { ChartTable } from '../Components/Table/table';
import Overlay from '../Components/Overlay/overlay';
import { Notification } from '../Components/Notification/notification';


/**
 * Infographics component for displaying data visualization.
 * 
 * This component:
 * - Manages state for chart data, code input, and loading status.
 * - Provides a CodeEditor for users to input SPARQL queries.
 * - Fetches chart data based on the query and displays it in a ChartTable.
 * - Displays an overlay during data loading.
 * 
 * @returns {JSX.Element} The Infographics component.
 */
const Infographics = () => {
  const [chartData, setChartData] = useState({});
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("")


  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check user authentication status
        const response = await api.get("/user-info");
        if (response.data.username) {
          console.log("User authenticated: " + response.data.username);
          setUsername(response.data.username);
        } else {
          console.error("User is not authenticated");
        }
      } catch (error) {
        setError(error?.response?.data?.error || "You are Not logged in")
        console.error(error?.response?.data?.error || error);
      }
    };
    checkUser();
  }, []);


  /**
   * Updates the code state when the CodeEditor value changes.
   * 
   * @param {string} newCode - The updated code from CodeEditor.
   */
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };


  /**
   * Fetches chart data based on the SPARQL query from the code state.
   * Sets the chart data and handles loading state.
   */
  const getChartData = async () => {
    try {
      setIsLoading(true);
      const sparql_query = code;
      const response = await api.post('/query', { sparql_string: sparql_query });
      setChartData(response.data.data);
      console.log(response.data);
    } catch (error) {
      setError(error?.response?.data?.error || "Error fetching data")
      console.error(error?.response?.data?.error || error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearError = () => {
    setError("");
  }


  return (
    <>

      <NavBar username={username}/>
      <div className="min-h-screen px-4 py-8 mx-auto bg-gray-100 container mt-4">
        {error && <Notification message={error} clearError={handleClearError}/>}
        <div className="grid grid-rows-5 gap-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-4">
          <div className="lg:col-span-2 row-span-1 border overflow-x-auto bg-white">
            <CodeEditor onCodeChange={handleCodeChange} handleFetchChartData={getChartData} isLoading={isLoading}/>
          </div>
          <div className="lg:col-span-3 row-span-4 border relative overflow-x-auto bg-white">
            {isLoading && <Overlay />}
            <ChartTable tableData={chartData.table} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Infographics;
