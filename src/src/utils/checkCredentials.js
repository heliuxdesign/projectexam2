import { getToken } from '../components/Storage';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function useCheckCredentials() {
    const navigate = useNavigate();
    useEffect(()=> {
       const token = getToken();  
       if (Array.isArray(token)) {
           navigate("/");
       }
    });
}

export function navigateToPost(id)
{
     console.log("Did it yeah!");
     console.log(id);
     //const test = useParams();
     //console.log(test)
     //const navigate = useNavigate();
     //useEffect(()=> { 
     //    navigate("/Post", {state: {id: id}});
    //});
}

export function navigateToProfile(name)
{
     console.log("pieru");
     console.log(name);
     
     //const test = useParams();
     //console.log(test)
     //const navigate = useNavigate();
     //useEffect(()=> { 
     //    navigate("/Post", {state: {id: id}});
    //});
}