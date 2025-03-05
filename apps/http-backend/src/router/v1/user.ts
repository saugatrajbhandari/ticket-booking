import { Router } from "express";
import authenticator from "authenticator";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config.js";
import { sendMessage } from "../../utils/twilio.js";
import { prismaClient } from "../../prisma.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  console.log(typeof phoneNumber);

  const otp = authenticator.generateToken(phoneNumber + "signup");

  const user = await prismaClient.user.upsert({
    where: {
      number: phoneNumber,
    },
    create: {
      number: phoneNumber,
      name: "saugat",
    },
    update: {},
  });

  // send otp to user
  console.log("result");

  try {
    console.log("result");
    const result = await sendMessage(phoneNumber, `otp:${otp}`);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "couldnot sent otp", error: { error } });
  }

  res.json({ id: otp });
});

router.post("/signup/verify", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const name = req.body.name;

  const otp = req.body.otp;

  const result = authenticator.verifyToken(phoneNumber + "signup", otp);
  console.log(result);

  // if (authenticator.verifyToken(phoneNumber + "signup", otp)) {
  //   res.json({
  //     message: "Invalid Token",
  //   });

  //   return;
  // }

  // const userId = await client.user.update({
  //   where: {
  //     number: phoneNumber,
  //   },
  //   data: {
  //     name,
  //     verified: true,
  //   },
  // });

  // const token = jwt.sign(
  //   {
  //     userId,
  //   },
  //   JWT_PASSWORD
  // );

  // console.log(result);

  res.json({ success: result ? true : false });
});

export default router as Router;
