import { EndToEndFlow } from "../util/EndToEndFlow.js";
import { createHouseWithThreePeopleAtom } from "./atoms/create-house-with-three-people-atom.js";

export const multiplePersonsFlow: EndToEndFlow = {
  name: "Multiple Persons Flow",
  fn: async () => {
    const createHouseWithThreePeopleAtomData =
      await createHouseWithThreePeopleAtom.setup();

    const { user2, user3, token1, token2, token3, houseId } =
      createHouseWithThreePeopleAtomData;

    // List persons

    const personListRes1 = await fetch(
      `http://localhost:9999/v1/person/${houseId}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody1 = await personListRes1.json();

    if (personListRes1.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes1.status,
        personListBody1
      );
      throw new Error();
    }

    if (personListBody1.persons.length != 3) {
      console.error(
        "Expected 3 persons, got",
        personListBody1.persons.length,
        personListBody1
      );
      throw new Error();
    }

    const person2Id = personListBody1.persons.find(
      (person: any) => person.name === user2
    ).id;

    const person3Id = personListBody1.persons.find(
      (person: any) => person.name === user3
    ).id;

    // Update house name

    const updateHouseNameRes1 = await fetch(
      `http://localhost:9999/v1/house/name`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token2}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houseId: houseId,
          newName: "John's house",
        }),
      }
    );

    if (updateHouseNameRes1.status != 204) {
      console.error(
        "Got unexpected status",
        updateHouseNameRes1.status,
        await updateHouseNameRes1.json()
      );
      throw new Error();
    }

    // Reflect name change

    const listHousesRes2 = await fetch(`http://localhost:9999/v1/house/mine`, {
      headers: {
        Authorization: `Bearer ${token3}`,
      },
    });

    const listHousesBody2 = await listHousesRes2.json();

    if (listHousesRes2.status != 200) {
      console.error(
        "Got unexpected status",
        listHousesRes2.status,
        listHousesBody2
      );
      throw new Error();
    }

    const johnsHouse = listHousesBody2.houses.find(
      (house: any) => house.id === houseId
    );

    if (johnsHouse == null) {
      console.error("John's house not found.");
      throw new Error();
    }

    if (johnsHouse.name != "John's house") {
      console.error("Expected John's house, got", johnsHouse.name);
      throw new Error();
    }

    // Get detailed information about person

    const personRes1 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personBody1 = await personRes1.json();

    if (personRes1.status != 200) {
      console.error("Got unexpected status", personRes1.status, personBody1);
      throw new Error();
    }

    if (personBody1.person.name != user2) {
      console.error("Expected", user2, "got", personBody1.person.name);
      throw new Error();
    }

    // Kick someone out

    const removePerson1 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (removePerson1.status != 204) {
      console.error(
        "Got unexpected status",
        removePerson1.status,
        await removePerson1.json()
      );
      throw new Error();
    }

    // List persons again

    const personListRes2 = await fetch(
      `http://localhost:9999/v1/person/${houseId}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody2 = await personListRes2.json();

    if (personListRes2.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes2.status,
        personListBody2
      );
      throw new Error();
    }

    if (personListBody2.persons.length != 2) {
      console.error(
        "Expected 2 persons, got",
        personListBody2.persons.length,
        personListBody2
      );
      throw new Error();
    }

    // Leave house

    const removePerson2 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person3Id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token3}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ houseId: houseId }),
      }
    );

    if (removePerson2.status != 204) {
      console.error(
        "Got unexpected status",
        removePerson2.status,
        await removePerson2.json()
      );
      throw new Error();
    }

    // List persons again

    const personListRes3 = await fetch(
      `http://localhost:9999/v1/person/${houseId}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const personListBody3 = await personListRes3.json();

    if (personListRes3.status != 200) {
      console.error(
        "Got unexpected status",
        personListRes3.status,
        personListBody3
      );
      throw new Error();
    }

    if (personListBody3.persons.length != 1) {
      console.error(
        "Expected 1 person, got",
        personListBody3.persons.length,
        personListBody3
      );
      throw new Error();
    }

    await createHouseWithThreePeopleAtom.teardown(
      createHouseWithThreePeopleAtomData
    );
  },
};
