import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken, getUsername } from '../Storage.js';
import { Card, Button, Container, Form } from 'react-bootstrap';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from 'react-router-dom';

const schema = yup.object().shape({
    title: yup.string().required("Please enter a username"),
    body: yup.string().required("Please write some text"),
    media: yup.string()
});


export default function Post() {
    useCheckCredentials();
    const { id } = useParams();
    const postUrl = postsUrl + "/" + id +"?_author=true&_comments=true"
    const reactionUrl = postsUrl + "/" + id + "/react/";
    const commentUrl = postsUrl + "/" + id + "/comment";
    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);
    const [hideForm, setHideForm] = useState(true);
    const [updateError, setUpdateError] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [comment, setComment] = useState('');
  
    useEffect(() => {
        (async ()=> {
            try {
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + getToken()
                    }
                };
                const response = await fetch(postUrl, options);
                if (response.ok) {
                    const data = await response.json();
                    setPostData(data);
                }
                else {
                    setPostError("Could not fetch content from API");
                }
            } catch(error) {
                setPostError(error);
            } 
        })();
    }, []); 

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const updatePost = async (data) => {
        const options = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(postUrl, options);
            const json = await response.json();
            
            if (!response.ok){
                setUpdateError(json.errors[0].message);
            }
            else {
                setHideForm(true);
                setPostData(json);
                setUpdateError(null);
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
        }
    }

    const handleUpdateClick = () => {
        setHideForm(false);
    }

    const onSubmit = (data)=>{
        updatePost(data);
    };

    const handleEmojiClick = async (emoji) => {
        setSelectedEmoji(emoji);
        const options = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        };
        try {
            const response = await fetch(reactionUrl + emoji, options);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
            }
            else {
                console.log(data.errors[0].message);
            }
        } catch(error) {
            console.log("Error");
        } 
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };
    
    const handleCommentSubmit = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({body: comment}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };  
        try {
            const response = await fetch(commentUrl, options);
            const json = await response.json();
            
            if (!response.ok){
                setUpdateError(json.errors[0].message);
            }
            else {
                setUpdateError(null);
                setPostData({...postData, comments: [...postData?.comments || [], {body: comment}]});
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
        }
        setComment('');
    };

    return (
    <>
    <Navigation />
    <Heading title="Post" /> 
    <p className="centered">Go back to <Link to={`/Posts/`} className="my-link">Posts</Link></p>
    {postError ? ( <div>Error: {postError}</div>) : (
    <Container className="form-container">
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Text>
                    <Card.Img  style={{width: "10%", height: "10%" }} variant="top" src={postData.author?.avatar} alt="some alt image"/>
                    {postData.author && postData.author.name}
                </Card.Text>
                <Card.Title>{postData.title}</Card.Title>
                {postData.media && <Card.Img variant="top" src={postData.media} alt="some alt image"/>}
                <Card.Text>{postData.body}</Card.Text>
                <h5>Comments:</h5>
                {postData.comments?.map(comment => (<div>{comment.body}</div>))} 
                <Button onClick={() => handleEmojiClick('👍')}>👍</Button>
                <Button onClick={() => handleEmojiClick('❤️')}>❤️</Button>
                {selectedEmoji && <p>Your reaction {selectedEmoji}</p>}
                <input type="text" value={comment} onChange={handleCommentChange} />
                <Button className="button-green" onClick={handleCommentSubmit}>Submit comment</Button>
                {(getUsername() === postData.author?.email) && <Button className="button-red" id={postData.id} onClick={handleUpdateClick}>Update Post</Button>}
            </Card.Body>
        </Card>
    </Container>)}
            
    {hideForm ? (<div></div>) : (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input className="input-group" type="text" placeholder="Title" {...register("title")} />
      <input className="input-group" type="text" placeholder="Body" {...register("body")} />
      <input className="input-group" type="url" placeholder="Image url" {...register("media")} />
      {updateError && <span>{updateError}</span>}
      <button className="button-green">Submit</button>
    </Form>)}           
    </>
    )      
}
