import { validateLogin, validateRegister } from "../middleware/validation.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
export const register = async (request, response) => {
  try {
    const { error: problem, value: checkedData } = validateRegister(request.body);
    if (problem) {
      return response.status(400).send(problem);
    }

    const {
      firstName,
      lastName,
      email,
      password,
      location,
      description,
      occupation,
    } = checkedData;

    const existingAccount = await User.findOne({ email });
    if (existingAccount) {
      return response.status(400).json({ message: "Email already exists" });
    }

    const hashRounds = 10;
    const passwordHash = await bcryptjs.hash(password, hashRounds);
    const createdUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      description,
      occupation,
    });
    await createdUser.save();
    return response.status(201).json({
      message: "User created successfully",
      user: {
        id: createdUser._id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
      },
    });
  } catch (problem) {
    console.error("Registration failed:", problem);

    return response.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const login = async (request, response) => {
  try {
    const { error: problem, value: checkedData } = validateLogin(request.body);

    if (problem) {
      return response.status(400).json({
        message: problem.details[0].message,
      });
    }

    const { email, password } = checkedData;

    const savedUser = await User.findOne({ email }).select("+password");

    if (!savedUser) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcryptjs.compare(
      password,
      savedUser.password
    );

    if (!passwordMatches) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }
//on success generate session

    return request.session.regenerate((problem) => {
      if (problem) {
        return response.status(500).json({ message: "Could not create session" });
      }

      request.session.userId = savedUser._id.toString();

      request.session.save((problem) => {
        if (problem) {
          return response.status(500).json({ message: "Could not save session" });
        }

        return response.status(200).json({
          message: "Logged in successfully",
          user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
          },
        });
      });
    });

  } catch (problem) {
    console.error("Login failed:", problem);

    return response.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const logout = async (request, response) => {
  try{

    request.session.destroy((problem) => {
      if (problem) {
        return response.status(500).json("Error signing out")

      }
      response.clearCookie("connect.sid", { path: "/" });
    return response.status(200).json("Signout successful")
    })

  }
  catch(problem){
    return response.status(500).json("Error signing out")

  }
}
