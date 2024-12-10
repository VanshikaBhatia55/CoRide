import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import { useAuth0 } from '@auth0/auth0-react'
import Tab from '@mui/material/Tab';

import PassengerRequests from "../components/PassengerRequests";
import UpcomingRides from "../components/UpcomingRides";

export default function MyRides() {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuth0();
  const [value, setValue] = useState(0);
  const [allRides,setAllRides] = useState([]);
  const [takenRides,setTakenRides] = useState([]);
  const [offeredRides,setOfferedRides] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/myRides?email=${user.email}`);
        console.log(response.data); // Handle the response data accordingly
      } catch (error) {
        console.error('Error fetching rides:', error);
        // Handle error (e.g., display error message)
      }finally{
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <p>Loading...</p>
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Navbar />
      <div className="px-3">
        <div className="font-semibold text-3xl">My Rides</div>
        <div>
          <div className="w-[100%]">
            <div className="border-b-2">
              <Tabs value={value} onChange={handleChange} sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'green', // Set the indicator color to green
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            '&.Mui-selected': {
              color: 'green', // Set the text color of the selected tab to green
            },
          },
        }}>
                <Tab label="All Rides" {...a11yProps(0)} />
                <Tab label="Passenger Requests " {...a11yProps(1)} />
              </Tabs>
            </div>
              {isLoading?(<p>Loading...</p>):
              (<div>
                <CustomTabPanel value={value} index={0}>
                  <UpcomingRides/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <PassengerRequests/>
                </CustomTabPanel>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );

}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// export default function BasicTabs() {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//           <Tab label="Item One" {...a11yProps(0)} />
//           <Tab label="Item Two" {...a11yProps(1)} />
//           <Tab label="Item Three" {...a11yProps(2)} />
//         </Tabs>
//       </Box>
//       <CustomTabPanel value={value} index={0}>
//         Item One
//       </CustomTabPanel>
//       <CustomTabPanel value={value} index={1}>
//         Item Two
//       </CustomTabPanel>
//       <CustomTabPanel value={value} index={2}>
//         Item Three
//       </CustomTabPanel>
//     </Box>
//   );
// }
