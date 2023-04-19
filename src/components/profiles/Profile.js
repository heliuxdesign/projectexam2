import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { profilesUrl } from '../../constants/api';
import { getToken, getName } from '../Storage.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


export default function Profile() {
    useCheckCredentials();
    const { name } = useParams();
    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
  
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
                const response = await fetch(profilesUrl + "/" + name + "?_followers=true", options);
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                    setIsFollowing(data.followers.some((follower) => follower.name == getName()));
                }
                else {
                    setProfileError("Could not fetch content from API");
                }
            } catch(error) {
                setProfileError(error);
            } 
        })();
    }, []);

    const handleFollowClick = async () => {
        const follow_or_unfollow = isFollowing ? "unfollow" : "follow";
        const difference = isFollowing ? -1 : 1;
        const followUrl = profilesUrl + "/" + name + "/" + follow_or_unfollow;
        const options = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(followUrl, options);
            const data = await response.json();
            if (response.ok) {
                setProfileData({
                    ...profileData, 
                    _count: {
                        ...profileData._count,
                        followers: profileData._count.followers + difference
                    }
                });
                setIsFollowing(!isFollowing);
            }
            else {
                setProfileError("Could not fetch content from API");
            }
        } catch(error) {
            setProfileError(error);
        } 
        
    }   
    
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
            {isFollowing ? (
                <Button onClick={handleFollowClick}>Unfollow</Button>
            ) : (
                <Button onClick={handleFollowClick}>Follow</Button> 
            )}
        </Card.Body>
    </Card>)}                     
    </>
    )      
}
