import axios from "axios";
import { appAxios } from "./apiInterceptors";
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay'
import { navigate } from "@utils/NavigationUtils";
import { Colors } from "@utils/Constants";

export const createTransaction = async (amount: number, userId: string) => {

    try {
        const res = await appAxios.post('/transaction', {
            amount: amount * 100,
            userId
        });

        return res.data;

    } catch (error) {
        return null;
    }
}
