import { EndToEndFlow } from "../EndToEndFlow";

export const pictureFlow: EndToEndFlow = {
  name: "Picture Flow",
  fn: async () => {
    const username = "FrankJames";
    const password = "password";

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

    // Create house

    const createHouseRes = await fetch("http://localhost:9999/v1/house", {
      method: "POST",
      body: JSON.stringify({ name: "House 1" }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const createHouseBody = await createHouseRes.json();

    if (createHouseRes.status != 201) {
      console.error(
        "Got unexpected status",
        createHouseRes.status,
        createHouseBody
      );
      throw new Error();
    }

    // Get person list

    const personListRes = await fetch(
      `http://localhost:9999/v1/person/${createHouseBody.house.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const personListBody = await personListRes.json();

    if (personListRes.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes.status,
        personListBody
      );
      throw new Error();
    }

    if (personListBody.persons.length != 1) {
      console.error("Expected 1 person, got", personListBody.persons.length);
      throw new Error();
    }

    const firstPerson = personListBody.persons[0];

    // Request image

    const imageRes = await fetch(
      `http://localhost:9999/v1/picture/${firstPerson.picture}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (imageRes.status != 200) {
      console.error("Got unexpected status", imageRes.status);
      throw new Error();
    }

    const imageBlob = await imageRes.blob();

    // Compare blobs

    const imageBlobBuffer = await imageBlob.arrayBuffer();
    const imageReqBlobBuffer = await imageReqBlob.arrayBuffer();

    if (!Buffer.from(imageBlobBuffer).equals(Buffer.from(imageReqBlobBuffer))) {
      console.error("Blobs are not equal");
      throw new Error();
    }

    // Update image

    const imageReq2 = await fetch("https://http.cat/404");

    const imageReqBlob2 = await imageReq2.blob();

    const updateImageRes2 = await fetch(
      "http://localhost:9999/v1/account/picture",
      {
        method: "PUT",
        body: imageReqBlob2,
        headers: {
          "Content-Type": "image/jpeg",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updateImageRes2.status != 204) {
      console.error(
        "Got unexpected status",
        updateImageRes2.status,
        await updateImageRes2.json()
      );
      throw new Error();
    }

    // Profile picture should have changed

    const imageRes2 = await fetch(
      `http://localhost:9999/v1/picture/${firstPerson.picture}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (imageRes2.status != 200) {
      console.error("Got unexpected status", imageRes2.status);
      throw new Error();
    }

    const imageBlob2 = await imageRes2.blob();

    const imageBlobBuffer2 = await imageBlob2.arrayBuffer();
    const imageReqBlobBuffer2 = await imageReqBlob2.arrayBuffer();

    if (
      !Buffer.from(imageBlobBuffer2).equals(Buffer.from(imageReqBlobBuffer2))
    ) {
      console.error("Blobs are not equal");
      throw new Error();
    }

    // Cleanup

    const deleteAccountRes = await fetch("http://localhost:9999/v1/account", {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (deleteAccountRes.status != 204) {
      console.error(
        "Got unexpected status",
        deleteAccountRes.status,
        await deleteAccountRes.json()
      );
      throw new Error();
    }

    const deleteHouseRes = await fetch(
      `http://localhost:9999/v1/house`,
      {
        method: "DELETE",
        body: JSON.stringify({ houseId: createHouseBody.house.id }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (deleteHouseRes.status != 204) {
      console.error(
        "Got unexpected status",
        deleteHouseRes.status,
        await deleteHouseRes.json()
      );
      throw new Error();
    }
  },
};
