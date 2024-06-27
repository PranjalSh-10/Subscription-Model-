import { useNavigate } from "react-router-dom";

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
      };

      if (token && authBool) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/admin/${path}`, {
        method: method,
        headers: headers,
        body: payload ? JSON.stringify(payload) : undefined,
      });

      // Check if response is not OK
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.code === 401) {
            return navigate('/');
          }
          throw new Error(data.error || 'An error occurred');
        } else {
          throw new Error('Server returned an invalid response');
        }
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error in sendData:', err);
      throw err; // Rethrow the error for the caller to handle
    }
  }

  return sendData;
}
