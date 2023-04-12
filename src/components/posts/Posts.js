import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials, navigateToPost } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import Card from 'react-bootstrap/Card';

export default function Posts() {
  useCheckCredentials();

  const [postData, setPostData] = useState([]);
  const [postError, setPostError] = useState(null);

  const apiCalls = [
      {url: postsUrl +"?_author=true", data: postData, setData: setPostData, error: postError, setError: setPostError}
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
    <Heading title="Posts" /> 
    <div className="container text-center">
      <div className="row align-items-start">
      <div className="col">
          <h1>Posts</h1>
          <Link to={`/Posts/CreatePost`}><h2>Create post</h2></Link>  
          {postError ? ( <div>Error: {postError}</div>) : (
          postData.map(item => (
          <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={item.media} alt="some alt image"/>
              <Card.Body>
              <Card.Title>{item.title}</Card.Title>
              <Card.Text>{item.body}</Card.Text>
              <Link to={`/Posts/Post/${item.id}`}>Go to Post</Link>  
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

