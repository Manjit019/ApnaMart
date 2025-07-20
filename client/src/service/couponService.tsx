import axios, { AxiosError } from "axios";
import { BASE_URL } from "./config";


export const applyCoupon = async (code:string,cartTotal : number) => {
    try {
        const res = await axios.post(`${BASE_URL}/coupon/apply`,{
            code,
            cartTotal
        });

        if(res.status === 200){
            return {success : true,...res.data}
        } else{
            return {success : false, message : res.data?.message}
        }
        
    } catch (error : any) {

        if(error?.response){
            const {status,data} = error.response;
             return {success : false, message : data?.message};
        }

        console.log("Error Applying coupon code", error);
        return {success : false, message : "Something went wrong! Failed to apply coupon code,"};
    }
}