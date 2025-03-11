import { create } from "zustand";


interface MapRefStore {
    mapRef : any,
    setMapRef : (ref: any) => void,
}

export const useMapRefStore = create<MapRefStore>((set)=>({
    mapRef : null,
    setMapRef : (ref: any) => set({ mapRef: ref }),
}))