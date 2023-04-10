import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl, profilesUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function Home() {
    useCheckCredentials();

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);

    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);

    const apiCalls = [
        {url: postsUrl, data: postData, setData: setPostData, error: postError, setError: setPostError},
        {url: profilesUrl, data: profileData, setData: setProfileData, error: setProfileError, setError: setProfileError},
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
                        shuffle(data);
                        call.setData(data.slice(0, 3));
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
      <Heading title="Home" /> 
      
      <Container>
        <Row>
        <Col xs={12} md={4}>
            <h1>Posts</h1>
            {postError ? ( <div>Error: {postError}</div>) : (
            postData.map(item => (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={item.media} alt="No image"/>
                <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.body}</Card.Text>
                <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
            )))}
        </Col>
        </Row>
      </Container>

      <div className="container text-center">
        <div className="row align-items-start">
        <div className="col">
            <h1>Profiles</h1>
            {profileError ? ( <div>Error: {profileError}</div>) : (
            profileData.map(item => (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={sanify_image_url(item.avatar)} alt="some alt image"/>
                <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text><img width="50" height="50" src={sanify_image_url(item.banner)} alt="som alt banner"/></Card.Text>
                <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
            )))}
        </div>
        </div>
      </div>
    </>
    )      
}

function sanify_image_url(url)
{
    if (url === null || url === undefined) return "images/alt_image.jpg"; 
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null) ? url : "images/alt_image.jpg"
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}