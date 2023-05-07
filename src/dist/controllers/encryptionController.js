// import { Request, Response, NextFunction } from "express";
// import { comparePassword } from "../models/encryption";
// import {
//   getUserId,
//   // ...
// } from "../models/db";
// export const login = async (req: Request, res: Response) => {
//   const { id, password } = req.body;
//   const user = await getUserId({ id });
//   if (!user) {
//     throw Error("incorrect username.");
//   }
//   try {
//     const match = comparePassword(password, user.password);
//     if (!match) {
//       return res.status(403).json({
//         message: "incorrect password.",
//       });
//     }
//     return res.json({
//       message: "User logged in successfully!",
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// };
