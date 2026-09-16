import { setUser, setLoading, setError } from "../state/auth.slice";
import { register } from "../services/auth.api";
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

  return { handleRegister };
};