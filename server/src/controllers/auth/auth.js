import "dotenv/config";
import { Customer, DeliveryPartner } from "../../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone, isPhoneVerified, liveLocation } = req.body;

    if (!phone) {
      return reply.status(400).send({ 
        message: "Phone number is required",
        phoneVerified: false 
      });
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return reply.status(400).send({ 
        message: "Invalid phone number format",
        phoneVerified: false 
      });
    }

    let customer = await Customer.findOne({ phone });

    if (customer && customer.isPhoneVerified) {
      console.log('Existing verified customer, logging in directly');
      
      if (liveLocation && liveLocation.latitude && liveLocation.longitude) {
        const newLocation = {
          latitude: Number(liveLocation.latitude),
          longitude: Number(liveLocation.longitude),
          accuracy: liveLocation.accuracy ? Number(liveLocation.accuracy) : undefined
        };
        if (!customer.liveLocation || 
            Math.abs(customer.liveLocation.latitude - newLocation.latitude) > 0.001 ||
            Math.abs(customer.liveLocation.longitude - newLocation.longitude) > 0.001) {
          customer.liveLocation = newLocation;
          await customer.save();
        }
      }

      const { accessToken, refreshToken } = generateToken(customer);
      const customerData = customer.toObject();
      delete customerData.__v;

      return reply.send({
        message: "Login successful",
        accessToken,
        refreshToken,
        customer: customerData,
        phoneVerified: true
      });
    }

    if (!customer) {
      const newCustomerData = {
        name: "User",
        phone,
        role: "Customer",
        isActivated: true,
        isPhoneVerified: false,
      };
      if (liveLocation && liveLocation.latitude && liveLocation.longitude) {
        newCustomerData.liveLocation = {
          latitude: Number(liveLocation.latitude),
          longitude: Number(liveLocation.longitude),
          accuracy: liveLocation.accuracy ? Number(liveLocation.accuracy) : undefined
        };
      }

      customer = new Customer(newCustomerData);
      await customer.save();

      console.log('New customer created, OTP verification required');
      
      return reply.status(200).send({
        message: "New user created. Phone verification required.",
        phoneVerified: false,
        customer: {
          _id: customer._id,
          phone: customer.phone,
          isPhoneVerified: false
        }
      });
    }

    if (customer && !customer.isPhoneVerified) {
      if (isPhoneVerified === true) {
        console.log('Updating customer phone verification status');
        
        customer.isPhoneVerified = true;
        if (liveLocation && liveLocation.latitude && liveLocation.longitude) {
          customer.liveLocation = {
            latitude: Number(liveLocation.latitude),
            longitude: Number(liveLocation.longitude),
            accuracy: liveLocation.accuracy ? Number(liveLocation.accuracy) : undefined
          };
        }
        
        await customer.save();

        const { accessToken, refreshToken } = generateToken(customer);
        const customerData = customer.toObject();
        delete customerData.__v;

        return reply.send({
          message: "Phone verified and login successful",
          accessToken,
          refreshToken,
          customer: customerData,
          phoneVerified: true
        });
      } else {
        console.log('Existing unverified customer, OTP verification required');
        
        return reply.status(200).send({
          message: "Phone verification required",
          phoneVerified: false,
          customer: {
            _id: customer._id,
            phone: customer.phone,
            isPhoneVerified: false
          }
        });
      }
    }

  } catch (error) {
    console.error("Login customer error:", error);
    return reply.status(500).send({ 
      message: "An error occurred during login",
      phoneVerified: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return reply.status(400).send({
        message: "Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.status(400).send({
        message: "Invalid email format",
      });
    }

    let deliveryPartner = await DeliveryPartner.findOne({
      email: email.toLowerCase(),
    });

    if (!deliveryPartner) {
      return reply.status(404).send({
        message: "Delivery partner not found",
      });
    }
    if (!deliveryPartner.isActivated) {
      return reply.status(403).send({
        message: "Account is not activated. Please contact support.",
      });
    }

    let isMatch = false;

    if (deliveryPartner.password.startsWith("$")) {
      isMatch = await bcrypt.compare(password, deliveryPartner.password);
    } else {
      isMatch = password === deliveryPartner.password;
    }

    if (!isMatch) {
      return reply.status(401).send({
        message: "Invalid credentials",
      });
    }
    const { accessToken, refreshToken } = generateToken(deliveryPartner);

    const partnerData = deliveryPartner.toObject();
    delete partnerData.password;
    delete partnerData.__v;

    return reply.send({
      message: "Login successful",
      accessToken,
      refreshToken,
      deliveryPartner: partnerData,
    });
  } catch (error) {
    console.error("Login delivery partner error:", error);
    return reply.status(500).send({
      message: "An error occurred during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refreshToken = async (req, reply) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return reply.status(401).send({
        message: "Refresh token is required",
      });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId).select("-password");
    } else {
      return reply.status(403).send({
        message: "Invalid role in token",
      });
    }

    if (!user) {
      return reply.status(403).send({
        message: "User not found",
      });
    }

    if (!user.isActivated) {
      return reply.status(403).send({
        message: "User account is not activated",
      });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

    return reply.send({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    if (error.name === "JsonWebTokenError") {
      return reply.status(403).send({
        message: "Invalid refresh token",
      });
    } else if (error.name === "TokenExpiredError") {
      return reply.status(403).send({
        message: "Refresh token has expired",
      });
    }

    return reply.status(500).send({
      message: "An error occurred while refreshing token",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;

    if (!userId || !role) {
      return reply.status(400).send({
        message: "Invalid token payload",
      });
    }

    let user;

    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId).select("-password");
    } else {
      return reply.status(403).send({
        message: "Invalid role",
      });
    }

    if (!user) {
      return reply.status(404).send({
        message: "User not found",
      });
    }

    if (!user.isActivated) {
      return reply.status(403).send({
        message: "User account is not activated",
      });
    }

    const userData = user.toObject();
    delete userData.__v;
    if (userData.password) delete userData.password;

    return reply.send({
      message: "User fetched successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return reply.status(500).send({
      message: "An error occurred while fetching user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};
