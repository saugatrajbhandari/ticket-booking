import { Router } from "express";
import authenticator from "authenticator";

const router = Router();

router.post("/signup", (req, res) => {
  console.log(req.body);
  const phoneNumber = req.body.phoneNumber;

  const result = authenticator.generateToken(phoneNumber + "signup");
  console.log(result);

  res.json({ result });
});

router.post("/signup/verify", (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const otp = req.body.otp;

  const result = authenticator.verifyToken(phoneNumber + "signup", otp);

  if (authenticator.verifyToken(phoneNumber + "signup", otp)) {
    res.json({
      message: "Invalid Token",
    });

    return;
  }

  res.json({});

  console.log(result);

  res.json({ result });
});

export default router as Router;
