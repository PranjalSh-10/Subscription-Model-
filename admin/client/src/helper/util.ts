import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export function useSendData() {
  const navigate = useNavigate();

  async function sendData(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    authBool: boolean,
    payload?: object,
  ) {
    try {
      const token = localStorage.getItem('token');
      let headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (token && authBool) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/admin/${path}`, {
        method: method,
        headers: headers,
        body: payload ? JSON.stringify(payload) : undefined,
      });

      const data = await response.json();
      // console.log('data received util: ', data);

      if(data.code===401){
        toast.error('Unathorised Access')
        navigate('/')
        throw new Error(data.message || 'Unauthorised access')
      }
      if (!response.ok) {
        toast.error(data.message || 'An error occurred');
        throw new Error(data.message || 'An error occurred');
      }

      if (data.status === 'ok' && data.result.message) {
        toast.success(data.result.message || 'Operation successful');
      }

      return data.result;

    } catch (err: any) { 
      console.error(err); 
      throw err; 
    }
  }
  return sendData;
}
