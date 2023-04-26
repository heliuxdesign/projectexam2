import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import  Heading  from '../layout/Heading';
import { Button, Form } from 'react-bootstrap';


const schema = yup.object().shape({
    name: yup.string().required("Please enter a username"),
    email: yup.string().required("Please enter an email address").email("Please enter a valid email address"),
    password: yup.string().required("Please enter a password")
});

async function registerUser(registerData) {

    const url = "https://api.noroff.dev/api/v1/social/auth/register";

    const options = {
        method: "POST",
        body: JSON.stringify(registerData),
        headers: {
            "Content-Type": "application/json",
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        
        if(json.errors) {
            console.log(json.errors);
        }
    }
    catch(error) {
        console.log(error.errors[0].message);
    }    
}

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    function onSubmit(data) {
        registerUser(data);    
    }

    return (
        <>
        <Heading />
            <h4>Not registered yet?</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <input className="input-group" type="text" placeholder="Name" {...register("name")} />
                <input className="input-group" type="text" placeholder="Email" {...register("email")} />
                <input className="input-group" type="password" placeholder="Password" {...register("password")} />
                {errors.email && <span>{errors.email.message}</span>}
                <button className="button-green">Create a new account</button>
            </Form>
        </>
    );
}

export default Register;