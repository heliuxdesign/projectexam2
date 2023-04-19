import { useEffect, useState } from 'react';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl, profilesUrl } from '../../constants/api';
import { getName, getToken } from '../Storage.js';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";



export default function Home() {
    useCheckCredentials();

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);

    const [profileData, setProfileData] = useState([]);
    const [profileError, setProfileError] = useState(null);

    const [myProfileData, setMyProfileData] = useState([]);
    const [myProfileError, setMyProfileError] = useState(null);

    const myProfileUrl  = profilesUrl + "/" + getName();

    const apiCalls = [
        {url: postsUrl + "?_active=true", data: postData, setData: setPostData, error: postError, setError: setPostError},
        {url: profilesUrl, data: profileData, setData: setProfileData, error: setProfileError, setError: setProfileError},
        {url: myProfileUrl, data: myProfileData, setData: setMyProfileData, error: myProfileError, setError: setMyProfileError},
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
                        console.log(data);
                        call.setData(Array.isArray(data) ? data.slice(0, 3) : data);
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

    const [hideForm, setHideForm] = useState(true);
    const [updateError, setUpdateError] = useState(null);

    const handleUpdateBannerAvatar = () => {
        setHideForm(false);
    }

    const schema = yup.object().shape({
        banner: yup.string(),
        avatar: yup.string(),
    });

    const updateMyProfile = async (data) => {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(myProfileUrl + "/media", options);
            const json = await response.json();
            
            if (!response.ok){
                setUpdateError(json.errors[0].message);
            }
            else {
                setHideForm(true);
                setMyProfileData(json);
                setUpdateError(null);
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
        }
    } 

    const onSubmit = (data)=>{
        console.log(data);
        updateMyProfile(data);
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    
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
                <Card.Img variant="top" src={item.avatar} alt="some alt image"/>
                <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text><img width="50" height="50" src={item.banner} alt="som alt banner"/></Card.Text>
                <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
            )))}
        </div>
        </div>
      </div>

      <Container>
        <Row>
        <Col xs={12} md={4}>
            <h1>My profile</h1>
            <Card style={{ width: '18rem' }}>
                <Card.Img />
                <Card.Body>
                <Card.Title>{myProfileData.name}</Card.Title>
                <Card.Text><img width="50" height="50" src={myProfileData.banner} alt="som alt banner"/></Card.Text>
                <Card.Text><img width="50" height="50" src={myProfileData.avatar} alt="som alt avatar"/></Card.Text>
                <Button onClick={handleUpdateBannerAvatar}>Update Banner and Avatar</Button>
                </Card.Body>
            </Card>
            {hideForm ? (<div></div>) : (
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("banner")} />
                <input {...register("avatar")} />
                {updateError && <span>{updateError}</span>}
                <button>Update</button>
            </form>)}           
        </Col>
        </Row>
      </Container>
    

    </>
    )      
}
