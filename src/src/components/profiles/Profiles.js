import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { Link } from 'react-router-dom';
import { postsUrl, profilesUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Contact() {
  useCheckCredentials();


  const [profileData, setProfileData] = useState([]);
  const [profileError, setProfileError] = useState(null);

  const apiCalls = [
      {url: profilesUrl, data: profileData, setData: setProfileData, error: setProfileError, setError: setProfileError}
  ]

  const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getToken()
      }
  };

  useEffect(() => {
      (async ()=> {
          for (const call of apiCalls) {
              try {
                  const response = await fetch(call.url, options);
                  if (response.ok) {
                      const data = await response.json();
                      call.setData(data);
                  }
                  else {
                      call.setError("Could not fetch content from API");
                  }
              } catch(error) {
                  call.setError(error);
              } 
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



