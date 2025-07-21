import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";



interface CouponStore{
    appliedCoupon : null,
    setCoupon : (coupon : any) => void;
    clearCoupon : () => void;
}

export const useCouponStore = create<CouponStore>()(
    persist((set,get)=>({
        appliedCoupon : null,
        setCoupon : coupon => set({appliedCoupon : coupon}),
        clearCoupon : () => set({appliedCoupon : null}),
    }),
    {
        name : 'coupon-storage',
        storage : createJSONStorage(()=> mmkvStorage),
    }
)
)