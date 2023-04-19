import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { saveToken, saveUser, saveName } from '../Storage.js';
import Heading from '../layout/Heading';

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
                saveToken(json.accessToken);
                if (json.email) {
                    saveUser(json.email);
                }
                if (json.name) {
                    saveName(json.name);
                }
                navigate("/Home");
            }
            
            if(json.errors) {
                console.log(json.errors);
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
        LoginUser(data); 
    }

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