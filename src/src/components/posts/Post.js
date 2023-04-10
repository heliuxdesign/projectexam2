import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Card from 'react-bootstrap/Card';


export default function Post() {
    useCheckCredentials();
    const { id } = useParams();
    console.log(id)

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);
  
    const apiCalls = [
        {url: postsUrl + "/" + id, data: postData, setData: setPostData, error: postError, setError: setPostError}
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
        <Heading title="Post" /> 
            {postError ? ( <div>Error: {postError}</div>) : (
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{postData.title}</Card.Title>
                        <Card.Img variant="top" src={postData.media} alt="some alt image"/>
                        <Card.Text>{postData.body}</Card.Text>
                    </Card.Body>
                </Card>
            )}              
    </>
    )      
}

function sanify_image_url(url)
{
  if (url === null || url === undefined) return "images/alt_image.jpg"; 
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null) ? url : "images/alt_image.jpg"
}

