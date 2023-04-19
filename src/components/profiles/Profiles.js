import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { Link } from 'react-router-dom';
import { profilesUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Card from 'react-bootstrap/Card';

export default function Contact() {
    useCheckCredentials();
    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);

    useEffect(() => {
        (async ()=> {   
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + getToken()
                }
            };
            try {
                const response = await fetch(profilesUrl, options);
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                }
                else {
                    setProfileError("Could not fetch content from API");
                }
            } catch(error) {
                setProfileError(error);
            } 
        })();
    }, []);
  
  return (
  <>
    <Navigation />
    <Heading title="Profiles" /> 
    <div className="container text-center">
      <div className="row align-items-start">
      <div className="col">
          <h1>Profiles</h1>
          {profileError ? ( <div>Error: {profileError}</div>) : (
          profileData.map(item => (
          <Card style={{ width: '18rem' }}>
            <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Link to={`/Profiles/Profile/${item.name}`}>Go to Profile</Link>  
            </Card.Body>
          </Card>
          )))}
      </div>
      </div>
    </div>
  </>
  )      
}



