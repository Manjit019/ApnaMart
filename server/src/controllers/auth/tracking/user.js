
import { Customer,DeliveryPartner } from "../../../models/index.js";

export const updateUser = async (req,reply)=>{
    try {
        const {userId} = req.user;
        const updateData = req.body;

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
        
        if(!user) return reply.status(404).json({message : "User not found"})
        
        let UserModel;
        if(user.role  === "Customer"){
            UserModel = Customer;
        }else if(user.role === "DeliveryPartner"){
            UserModel = DeliveryPartner;
        }else{
            return reply.status(400).json({message : "Invalid user role"})
        }

        const updatedUser = await UserModel.findByIdAndUpdate(user.id, 
            {$set : updateData},
            {new : true,runValidator : true },
            
        );

        if(!updatedUser){
            return reply.status(404).json({message : "User not found"});
        }

        return reply.send({message : "User updated successfully"});

    } catch (error) {
        return reply.status(500).send({message : "Failed to update user",error});
    }
}