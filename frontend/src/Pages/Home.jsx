import { useEffect } from "react";
import api from "../api/axios";
// import { useNavigate } from "react-router";

const Home = () => {


  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await api.get("/user-info");
        if (response.data.username) {
          console.log("user authenticated " + response.data.username);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
      }
    };
    checkUser();
  },[])



  const login = async () => {
    try {
      const response = await api.get('/login');
      console.log(response.data.redirect_url)
      window.open(response.data.redirect_url, '_blank');
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Todo App</h1>
      <button onClick={login}>Login with Wikimedia</button>
    </div>
  );
};

export default Home;