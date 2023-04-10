import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { profilesUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Card from 'react-bootstrap/Card';


export default function Profile() {
    useCheckCredentials();
    const { name } = useParams();
    console.log(name)

    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);
  
    const apiCalls = [
        {url: profilesUrl + "/" + name, data: profileData, setData: setProfileData, error: setProfileError, setError: setProfileError}
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
                        console.log(data);
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
        <Heading title="Profile" /> 
        {profileError ? ( <div>Error: {profileError}</div>) : (
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Text>{profileData.name}</Card.Text>
                        <Card.Img variant="top" src={profileData.avatar} alt="some alt avatar"/>
                        <Card.Img variant="top" src={profileData.banner} alt="some alt banner"/>
                        <Card.Text>E-mail: {profileData.email}</Card.Text>
                        <Card.Text>Followers: {profileData._count ? profileData._count.followers : "fetching..."} </Card.Text>
                        <Card.Text>Following: {profileData._count ? profileData._count.following : "fetching..."}</Card.Text>
                        <Card.Text>Posts: {profileData._count ? profileData._count.posts : "fetching..."}</Card.Text>
                    </Card.Body>
                </Card>
            )}   
                       
    </>
    )      
}
