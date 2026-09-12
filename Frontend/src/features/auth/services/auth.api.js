import axios from "axios";


const authApi=axios.create({
    baseURL:"http:localhost:3000/api/auth",
    withCredentials:true
})

export async function register({email,contact,password,fullname}){
    const response = await authApi.post("/register",{email,contact,password,fullname})
    return response.data;   
}