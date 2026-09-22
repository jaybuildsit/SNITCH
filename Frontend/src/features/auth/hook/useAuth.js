import { setUser, setLoading, setError } from "../state/auth.slice";
import { register, login, getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";


export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullName,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));

      const data = await register({
        email,
        contact,
        password,
        fullName,
        isSeller,
      });

      dispatch(setUser(data.user));
    } catch (error) {
      console.error("Registration error:", error);
      dispatch(
        setError(error.response?.data?.message || "Registration failed")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }


  async function handleLogin({ email, password }) {

    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      console.error("Login error:", error);
      dispatch(
        setError(error.response?.data?.message || "Login failed")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }


  async function handleGetMe() {
    try{
      dispatch(setLoading(true));
      const data=await getMe();
      dispatch(setUser(data.user));
    }
    catch(error){
      console.error("Get me error:", error);
      dispatch(
        setError(error.response?.data?.message || "Get-me failed")
      );
      // throw error;
    }
    finally{
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
};