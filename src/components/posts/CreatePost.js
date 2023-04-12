import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../layout/Heading';
import { useCheckCredentials, navigateToPost } from '../../utils/checkCredentials';
import Navigation from '../layout/Layout';
import { postsUrl } from '../../constants/api';
import { getToken } from '../Storage.js';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    title: yup.string().required("Please enter a username"),
    body: yup.string().required("Please write some text"),
    media: yup.string()
});



export default function CreatePost() {
    useCheckCredentials();

    const [postError, setPostError] = useState(null);

    const navigate = useNavigate();
    async function SubmitPost(postData){
        console.log(postData);

        const options = {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            }
        };
        console.log(options);
        try {
            const response = await fetch(postsUrl, options);
            const json = await response.json();
            
            if(response.ok) {
                navigate("/Posts")
            }
            else {
                console.log(json.errors[0].message);
                setPostError(json.errors[0].message)
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
        }
        
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) { 
        console.log("blahblah")
        SubmitPost(data);
    }

    return (
        <>
          <Navigation />
          <Heading title="CreatePost" /> 
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("title")} />
            <input {...register("body")} />
            <input {...register("media")} />
            {postError && <span>{postError}</span>}
            <button>Submit</button>
        </form>
        </>
    )

}