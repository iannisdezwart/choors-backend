import { EndToEndFlow } from "../EndToEndFlow";

export const updateAccountDetailsFlow: EndToEndFlow = {
  name: "Update account details flow",
  fn: async () => {
    const username = "FrankJames";
    const password = "password";

    const newUsername = "FrankJames2";
    const newPassword = "password2";

    const imageSrc = "https://http.cat/418";

    // Register

    const registerRes = await fetch("http://localhost:9999/v1/account", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const registerBody = await registerRes.json();

    if (registerRes.status != 201) {
      console.error("Got unexpected status", registerRes.status, registerBody);
      throw new Error();
    }

    const token = registerBody.token;

    // Update username

    const updateUsernameRes = await fetch(
      "http://localhost:9999/v1/account/username",
      {
        method: "PUT",
        body: JSON.stringify({ newUsername, username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (updateUsernameRes.status != 204) {
      console.error(
        "Got unexpected status",
        updateUsernameRes.status,
        await updateUsernameRes.json()
      );
      throw new Error();
    }

    // Update password

    const updatePasswordRes = await fetch(
      "http://localhost:9999/v1/account/password",
      {
        method: "PUT",
        body: JSON.stringify({ username: newUsername, password, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (updatePasswordRes.status != 204) {
      console.error(
        "Got unexpected status",
        updatePasswordRes.status,
        await updatePasswordRes.json()
      );
      throw new Error();
    }

    // Update image

    const imageReq = await fetch(imageSrc);
    const imageReqBlob = await imageReq.blob();

    const updateImageRes = await fetch(
      "http://localhost:9999/v1/account/picture",
      {
        method: "PUT",
        body: imageReqBlob,
        headers: {
          "Content-Type": "image/jpeg",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateImageRes.status != 204) {
      console.error(
        "Got unexpected status",
        updateImageRes.status,
        await updateImageRes.json()
      );
      throw new Error();
    }

    // Login with new username and password

    const loginRes = await fetch("http://localhost:9999/v1/account/login", {
      method: "POST",
      body: JSON.stringify({ username: newUsername, password: newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginBody = await loginRes.json();

    if (loginRes.status != 200) {
      console.error("Got unexpected status", loginRes.status, loginBody);
      throw new Error();
    }

    if (loginBody.token == null) {
      console.error("Token is null.");
      throw new Error();
    }

    // Delete the account now

    const deleteRes = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username: newUsername, password: newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteRes.status != 204) {
      console.error(
        "Got unexpected status",
        deleteRes.status,
        await deleteRes.json()
      );
      throw new Error();
    }
  },
};
