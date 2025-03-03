import axios from "axios";
import { describe, expect, it, test } from "vitest";

const BACKEND_URL = "http://localhost:8000";
const NAME = "saugat";
const PHONE = "98123453434";

describe("signup endpoint", () => {
  it("check double signup", async () => {
    const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      phone: PHONE,
    });
    const response2 = await axios.post(`${BACKEND_URL}/api/v1/users/verify`, {
      opt: "000000",
    });

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.data.id).not.toBeNull();

    expect(async () => {
      await axios.post(`${BACKEND_URL}/api/v1/users/verify`, {
        name: NAME,
        phone: PHONE,
      });
    }).toThrow();
  });
});
