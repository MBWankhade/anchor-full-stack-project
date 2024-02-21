import React, { useState } from "react";
import Banner from "../components/Banner";
import Jobs from "../Pages/Jobs";
import Card from "../components/Card";
import Sidebar from "../sidebar/Sidebar";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const[coins, setCoins] = useState(0);
  const itemsPerPage = 6;
  
  React.useEffect(() => {
    const email = localStorage.getItem('email');
    
    if (email) {
      fetch(`http://localhost:3000/get-coins?email=${email}`)
        .then((res) => res.json())
        .then((data) => setCoins(data.coins))
        .catch((error) => console.error('Error fetching coins:', error));
    }
  }, []);
  

  React.useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/internships")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        console.log(data)
        setIsLoading(false);
      });
  }, []);


  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleapplyJobs = (e) => {
    if (coins >= 50) {
      fetch(`http://localhost:3000/update-coins?email=${localStorage.getItem('email')}&coins=${coins-50}`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          setCoins(data.coins);
          window.alert("You have successfully applied for this job!");
        })
        .catch((error) => console.error('Error updating coins:', error));
    } else {
      window.alert("You don't have enough coins to apply for this job.");
    }
  };
  
  

  //filter jobs by title
  const filteredItems = jobs.filter(
    (job) => job['Role Name'].toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  //Radio filtering
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //button based filtering
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  // calculate the index range
  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  // function for the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // function for the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  //main function
  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    //filtering input items
    if (query) {
      filteredJobs = filteredItems;
    }

    //category filtering
    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({
          jobLocation,
          maxPrice,
          experienceLevel,
          salaryType,
          employmentType,
          postingDate,
        }) => {
          console.log(postingDate)
          console.log(selected); 
          console.log(postingDate > selected)
          return (
            jobLocation.toLowerCase() === selected.toLowerCase() ||
            parseInt(maxPrice) <= parseInt(selected) ||
            postingDate >= selected ||
            salaryType.toLowerCase() === selected.toLowerCase(0) ||
            experienceLevel.toLowerCase() === selected.toLowerCase() ||
            employmentType.toLowerCase() === selected.toLowerCase()
          );
        }
      );
    }

    // slice the data based on current page
    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);
    return filteredJobs.map((data, i) => <Card data={data} coins={coins} handleapplyJobs={handleapplyJobs} key={i} />);
  };
  const result = filteredData(jobs, selectedCategory, query);

  return (
    <div>
      <div className="fixed top-18 right-0 bg-white p-4 shadow-md rounded-lg m-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Coins Remaining: {coins}</h2>
      </div>

      <Banner query={query} handleInputChange={handleInputChange} />

      {/* main content */}
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        {/* left side */}
        <div className="bg-white p-4 rounded">
          {" "}
          <Sidebar handleChange={handleChange} handleClick={handleClick} />{" "}
        </div>

        {/* job cards */}
        <div className="col-span-2 bg-white p-4 rounded-sm">
          {isLoading ? (
            <p className="font-medium">Loading...</p>
          ) : result.length > 0 ? (
            <Jobs result={result} />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">{result.length}Jobs</h3>
              <p>No data found!</p>
            </>
          )}

          {/* pagination here */}
          {result.length > 0 ? (
            <div className="flex justify-center mt-4 space-x-8">
              <button onClick={prevPage} disabled={currentPage == 1} className="hover:underline">Previous</button>
              <span>
                Page {currentPage} of{" "}
                {Math.ceil(filteredItems.length / itemsPerPage)}
              </span>
              {/* <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length/itemsPerPage)}>Next</button> */}
              <button className="hover:underline" onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length/itemsPerPage)} >Next</button>
            </div>
          ) : (
            ""
          )}
        </div>


        {/* right side */}
        <div className="bg-white p-4 rounded"><Newsletter/></div>
      </div>
    </div>
  );
};

export default Home;
