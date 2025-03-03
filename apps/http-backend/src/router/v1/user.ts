import { Router } from "express";
import authenticator from "authenticator";
import { client } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

const router = Router();

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const phoneNumber = req.body.phoneNumber;

  const result = authenticator.generateToken(phoneNumber + "signup");
  console.log(result);

  const user = await client.user.upsert({
    where: {
      number: phoneNumber,
    },
    create: {
      number: phoneNumber,
    },
    update: {},
  });

  if (process.env.NODE_ENV === "production") {
    // send otp to user
  }

  res.json({ result });
});

router.post("/signup/verify", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const name = req.body.name;

  const otp = req.body.otp;

  const result = authenticator.verifyToken(phoneNumber + "signup", otp);

  if (authenticator.verifyToken(phoneNumber + "signup", otp)) {
    res.json({
      message: "Invalid Token",
    });

    return;
  }

  const userId = await client.user.update({
    where: {
      number: phoneNumber,
    },
    data: {
      name,
      verified: true,
    },
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_PASSWORD
  );

  res.json({ token });

  console.log(result);

  res.json({ result });
});

export default router as Router;
