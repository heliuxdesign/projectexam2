import { getToken } from '../components/Storage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useCheckCredentials() {
    const navigate = useNavigate();
    useEffect(()=> {
       const token = getToken();  
       console.log(token); 
       if (Array.isArray(token)) {
           navigate("/");
       }
    });
}