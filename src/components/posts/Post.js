import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken, getUsername } from '../Storage.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    title: yup.string().required("Please enter a username"),
    body: yup.string().required("Please write some text"),
    media: yup.string()
});


export default function Post() {
    useCheckCredentials();
    const { id } = useParams();
    const postUrl = postsUrl + "/" + id +"?_author=true&_comments=true"

    const [postData, setPostData] = useState([]);
    const [postError, setPostError] = useState(null);
    const [hideForm, setHideForm] = useState(true);
    const [updateError, setUpdateError] = useState(null);

    const apiCalls = [
        {url: postUrl, data: postData, setData: setPostData, error: postError, setError: setPostError}
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

      const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const updatePost = async (postData) => {
        console.log(postData);
        const options = {
            method: "PUT",
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };

        try {
            const response = await fetch(postUrl, options);
            const json = await response.json();
            
            if (!response.ok){
                console.log(json.errors[0].message);
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
                        {(postData.author && getUsername() === postData.author.email) && <Button id={postData.id} onClick={handleUpdateClick}>Update Post</Button>}
                    </Card.Body>
                </Card>
            )} 
            
            {hideForm ? (<div></div>) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("title")} />
                    <input {...register("body")} />
                    <input {...register("media")} />
                    {updateError && <span>{updateError}</span>}
                    <button>Submit</button>
                </form>  
            )}           
    </>
    )      
}

