import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { saveToken, getToken } from '../Storage.js';
import { saveUser } from '../Storage.js';
import Heading from '../layout/Heading';
//import "./App.css";


const schema = yup.object().shape({
    name: yup.string().required("Please enter a username"),
    email: yup.string().required("Please enter an email address").email("Please enter a valid email address"),
    password: yup.string().required("Please enter a password")
});




function Login() {
    const navigate = useNavigate();

    async function LoginUser(loginData) {
        const url = "https://api.noroff.dev/api/v1/social/auth/login";
    
        const options = {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }
        };
        
        
        try {
            const response = await fetch(url, options);
            const json = await response.json();
    
            if(json.accessToken) {
                console.log("Saved token...")
                saveToken(json.accessToken);
                //const token = getToken();  
                //console.log(token); 
               //if (!Array.isArray(token)) {
                console.log("Got here for some reason");
                navigate("/Home");
                //}
                //saveUser(json.user);
                //location.href = "www.vg.no";
            }
            
            if(json.errors) {
                console.log(json.errors);
                /*displayError("warning", 
                               "Login is not succesful: invalid login details", 
                               ".message-container-form"); */
            }
        }
        catch(error) {
            console.log(error.errors[0].message);
           /* displayError("error",
                           "Failed to connect",
                           ".message-container-form");*/
        }
        
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) {
        LoginUser(data); 
    }

    //console.log(errors);

    return (
        <>
        <Heading title="Login" />
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} />
            <input {...register("email")} />
            <input {...register("password")} />
            {errors.email && <span>{errors.email.message}</span>}
            <button>Login</button>
        </form>
        </>
    );
}

export default Login;