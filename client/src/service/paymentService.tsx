import axios from "axios";
import { appAxios } from "./apiInterceptors";
import RazorpayCheckout, {CheckoutOptions} from 'react-native-razorpay'
import { navigate } from "@utils/NavigationUtils";

export const createTransaction = async (amount:number,userId : string) => {
    try {
       const res = await appAxios.post('/order/transcation',{
        userId,
        amount : amount * 100
       });

       return res.data;

    } catch (error) {
        return null;
    }
}

export const createRazorpayOrder = async (key:string,amount : number,order_id : string,cart : any,userId : string, address : string) => {
    try {
        let options:CheckoutOptions = {
            description : "Grocery Shopping",
            image : "",
            currency : "INR",
            key : key,
            amount : amount,
            name: "ApnaMart",
            order_id : order_id,
            theme : {
                color : '#23448cd7'
            },
        }

        RazorpayCheckout.open(options).then(async (data)=>{
            const today = new Date();
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(today.getDate()+2);

            const res = await appAxios.post(`/order`,{
                razorpay_order_id : order_id,
                razorpay_payment_id : data?.razorpay_payment_id,
                razorpay_signature : data?.razorpay_signature,
                userId : userId,
                cartItem : cart,
                deliveryDate : twoDaysFromNow,
                address : address
            });

            navigate("PaymentSuccess");
        }).catch(err => {
            console.log(err);
            return {type : 'error', message : 'Error!'}
        })


    } catch (error) {
        console.error("Error creating order : ",error);
        return {type : 'error',message : 'Error!'}
    }
}