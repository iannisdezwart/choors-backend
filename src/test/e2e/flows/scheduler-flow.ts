import ms from "ms";
import { EndToEndFlow } from "../util/EndToEndFlow.js";
import { createHouseWithThreePeopleAtom } from "./atoms/create-house-with-three-people-atom.js";

export const schedulerFlow: EndToEndFlow = {
  name: "Scheduler Flow",
  fn: async (timeProvider) => {
    const createHouseWithThreePeopleAtomData =
      await createHouseWithThreePeopleAtom.setup();

    const { user1, user2, user3, token1, token2, token3, houseId } =
      createHouseWithThreePeopleAtomData;

    // Get list of people in the house

    const getPeopleRes = await fetch(
      `http://localhost:9999/v1/person/${houseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getPeopleBody = await getPeopleRes.json();

    if (getPeopleRes.status != 200) {
      console.error(
        "Got unexpected status",
        getPeopleRes.status,
        getPeopleBody
      );
      throw new Error();
    }

    const person1Id = getPeopleBody.persons.find(
      (person: any) => person.name === user1
    ).id;

    const person2Id = getPeopleBody.persons.find(
      (person: any) => person.name === user2
    ).id;

    const person3Id = getPeopleBody.persons.find(
      (person: any) => person.name === user3
    ).id;

    // Create task groups

    const updateTaskGroupRes = await fetch(
      `http://localhost:9999/v1/group/${houseId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          addedGroups: ["group1", "group2", "group3"],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (updateTaskGroupRes.status != 204) {
      console.error(
        "Got unexpected status",
        updateTaskGroupRes.status,
        updateTaskGroupRes.json()
      );
      throw new Error();
    }

    // List task groups

    const getTaskGroupsRes = await fetch(
      `http://localhost:9999/v1/group/${houseId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getTaskGroupsBody = await getTaskGroupsRes.json();

    if (getTaskGroupsRes.status != 200) {
      console.error(
        "Got unexpected status",
        getTaskGroupsRes.status,
        getTaskGroupsBody
      );
      throw new Error();
    }

    const group1Id = getTaskGroupsBody.groups.find(
      (group: any) => group.name === "group1"
    ).id;

    const group2Id = getTaskGroupsBody.groups.find(
      (group: any) => group.name === "group2"
    ).id;

    const group3Id = getTaskGroupsBody.groups.find(
      (group: any) => group.name === "group3"
    ).id;

    // Add people to task groups

    const updatePersonGroupRes1 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person1Id}/groups`,
      {
        method: "PATCH",
        body: JSON.stringify({ groupIds: [group1Id] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (updatePersonGroupRes1.status != 204) {
      console.error(
        "Got unexpected status",
        updatePersonGroupRes1.status,
        await updatePersonGroupRes1.json()
      );
      throw new Error();
    }

    const updatePersonGroupRes2 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}/groups`,
      {
        method: "PATCH",
        body: JSON.stringify({ groupIds: [group1Id, group2Id, group3Id] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (updatePersonGroupRes2.status != 204) {
      console.error(
        "Got unexpected status",
        updatePersonGroupRes2.status,
        await updatePersonGroupRes2.json()
      );
      throw new Error();
    }

    const updatePersonGroupRes3 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person3Id}/groups`,
      {
        method: "PATCH",
        body: JSON.stringify({ groupIds: [group2Id] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (updatePersonGroupRes3.status != 204) {
      console.error(
        "Got unexpected status",
        updatePersonGroupRes3.status,
        await updatePersonGroupRes3.json()
      );
      throw new Error();
    }

    // Create tasks

    const task1 = {
      name: "Task 1",
      description: "Description 1",
      freqBase: new Date(timeProvider.now() + ms("1h")),
      freqOffset: ms("7h"),
      timeLimit: ms("1h"),
      scheduleOffset: 0,
      points: 10,
      penalty: 1,
      responsibleTaskGroup: "group1",
    };

    const createTaskRes1 = await fetch(
      `http://localhost:9999/v1/task/${houseId}`,
      {
        method: "POST",
        body: JSON.stringify(task1),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (createTaskRes1.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskRes1.status,
        await createTaskRes1.json()
      );
      throw new Error();
    }

    const task2 = {
      name: "Task 2",
      description: "Description 2",
      freqBase: new Date(timeProvider.now() + ms("2h")),
      freqOffset: ms("7h"),
      timeLimit: ms("1h"),
      scheduleOffset: 0,
      points: 7,
      penalty: 1,
      responsibleTaskGroup: "group2",
    };

    const createTaskRes2 = await fetch(
      `http://localhost:9999/v1/task/${houseId}`,
      {
        method: "POST",
        body: JSON.stringify(task2),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (createTaskRes2.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskRes2.status,
        await createTaskRes2.json()
      );
      throw new Error();
    }

    const task3 = {
      name: "Task 3",
      description: "Description 3",
      freqBase: new Date(timeProvider.now() + ms("3h")),
      freqOffset: ms("7h"),
      timeLimit: ms("1h"),
      scheduleOffset: 0,
      points: 5,
      penalty: 1,
      responsibleTaskGroup: "group3",
    };

    const createTaskRes3 = await fetch(
      `http://localhost:9999/v1/task/${houseId}`,
      {
        method: "POST",
        body: JSON.stringify(task3),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (createTaskRes3.status != 204) {
      console.error(
        "Got unexpected status",
        createTaskRes3.status,
        await createTaskRes3.json()
      );
      throw new Error();
    }

    // List detailed person 1 and check that he has no scheduled tasks

    const getDetailedPersonRes1 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person1Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody1 = await getDetailedPersonRes1.json();

    if (getDetailedPersonRes1.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes1.status,
        getDetailedPersonBody1
      );
      throw new Error();
    }

    if (getDetailedPersonBody1.person.schedule.length != 0) {
      console.error(
        "Expected 0 scheduled tasks, got",
        getDetailedPersonBody1.person.schedule.length,
        getDetailedPersonBody1
      );
      throw new Error();
    }

    // List detailed person 2 and check that he has no scheduled tasks

    const getDetailedPersonRes2 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody2 = await getDetailedPersonRes2.json();

    if (getDetailedPersonRes2.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes2.status,
        getDetailedPersonBody2
      );
      throw new Error();
    }

    if (getDetailedPersonBody2.person.schedule.length != 0) {
      console.error(
        "Expected 0 scheduled tasks, got",
        getDetailedPersonBody2.person.schedule.length,
        getDetailedPersonBody2
      );
      throw new Error();
    }

    // List detailed person 3 and check that he has no scheduled tasks

    const getDetailedPersonRes3 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person3Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody3 = await getDetailedPersonRes3.json();

    if (getDetailedPersonRes3.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes3.status,
        getDetailedPersonBody3
      );
      throw new Error();
    }

    if (getDetailedPersonBody3.person.schedule.length != 0) {
      console.error(
        "Expected 0 scheduled tasks, got",
        getDetailedPersonBody3.person.schedule.length,
        getDetailedPersonBody3
      );
      throw new Error();
    }

    // Go 1.5h into the future so that the first task is scheduled

    timeProvider.advance(ms("1.5h"));
    await new Promise((r) => setTimeout(r, 1000));

    // Either person 1 or person 2 should have the first task scheduled

    const getDetailedPersonRes4 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person1Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody4 = await getDetailedPersonRes4.json();

    if (getDetailedPersonRes4.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes4.status,
        getDetailedPersonBody4
      );
      throw new Error();
    }

    const getDetailedPersonRes5 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody5 = await getDetailedPersonRes5.json();

    if (getDetailedPersonRes5.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes5.status,
        getDetailedPersonBody5
      );
      throw new Error();
    }

    if (
      (getDetailedPersonBody4.person.schedule.length == 0 &&
        getDetailedPersonBody5.person.schedule.length == 0) ||
      getDetailedPersonBody4.person.schedule.length +
        getDetailedPersonBody5.person.schedule.length !=
        1
    ) {
      console.error(
        "Expected one new scheduled task among person1 and person2, got",
        getDetailedPersonBody4.person,
        getDetailedPersonBody5.person
      );
      throw new Error();
    }

    const personIdWhoHasToDoTask1 =
      getDetailedPersonBody4.person.schedule.length == 1
        ? person1Id
        : person2Id;
    const scheduledTaskId =
      getDetailedPersonBody4.person.schedule.length == 1
        ? getDetailedPersonBody4.person.schedule[0].id
        : getDetailedPersonBody5.person.schedule[0].id;

    // Mark the task as done

    const markTaskDone = await fetch(
      `http://localhost:9999/v1/schedule/${houseId}/scheduled-task/${scheduledTaskId}/mark-done`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    if (markTaskDone.status != 204) {
      console.error(
        "Got unexpected status",
        markTaskDone.status,
        await markTaskDone.json()
      );
      throw new Error();
    }

    const person2Tasks = getDetailedPersonBody5.person.schedule.length;

    // Go another 1h into the future so that the second task is scheduled

    timeProvider.advance(ms("1h"));
    await new Promise((r) => setTimeout(r, 1000));

    // The person that marked the first task done should not have a penalised completed task

    const noPenalisedCompletedTask = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${personIdWhoHasToDoTask1}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const noPenalisedCompletedTaskBody = await noPenalisedCompletedTask.json();

    if (noPenalisedCompletedTask.status != 200) {
      console.error(
        "Got unexpected status",
        noPenalisedCompletedTask.status,
        noPenalisedCompletedTaskBody
      );
      throw new Error();
    }

    if (noPenalisedCompletedTaskBody.person.schedule.length != 0) {
      console.error(
        "Expected 0 completed tasks, got",
        noPenalisedCompletedTaskBody.person.schedule.length,
        noPenalisedCompletedTaskBody
      );
      throw new Error();
    }

    if (noPenalisedCompletedTaskBody.person.historicalTasks.length != 1) {
      console.error(
        "Expected 1 historical task, got",
        noPenalisedCompletedTaskBody.person.historicalTasks.length,
        noPenalisedCompletedTaskBody
      );
      throw new Error();
    }

    if (noPenalisedCompletedTaskBody.person.historicalTasks[0].isPenalised) {
      console.error(
        "Expected no penalised completed tasks, got",
        noPenalisedCompletedTaskBody.person.historicalTasks[0],
        noPenalisedCompletedTaskBody
      );
      throw new Error();
    }

    // Either person 2 or person 3 should have the second task scheduled

    const getDetailedPersonRes6 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody6 = await getDetailedPersonRes6.json();

    if (getDetailedPersonRes6.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes6.status,
        getDetailedPersonBody6
      );
      throw new Error();
    }

    const getDetailedPersonRes7 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person3Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody7 = await getDetailedPersonRes7.json();

    if (getDetailedPersonRes7.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes7.status,
        getDetailedPersonBody7
      );
      throw new Error();
    }

    if (
      (getDetailedPersonBody6.person.schedule.length == 0 &&
        getDetailedPersonBody7.person.schedule.length == 0) ||
      getDetailedPersonBody6.person.schedule.length +
        getDetailedPersonBody7.person.schedule.length !=
        1
    ) {
      console.error(
        "Expected one new scheduled task among person2 and person3, got",
        getDetailedPersonBody6.person,
        getDetailedPersonBody7.person
      );
      throw new Error();
    }

    const personIdWhoHasToDoTask2 =
      getDetailedPersonBody6.person.schedule.length == 1
        ? person2Id
        : person3Id;

    const newPerson2Tasks = getDetailedPersonBody6.person.schedule.length;

    // Go another 1h into the future so that the third task is scheduled for person 2

    timeProvider.advance(ms("1h"));
    await new Promise((r) => setTimeout(r, 1000));

    // Person 2 should have the third task scheduled

    const getDetailedPersonRes8 = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${person2Id}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const getDetailedPersonBody8 = await getDetailedPersonRes8.json();

    if (getDetailedPersonRes8.status != 200) {
      console.error(
        "Got unexpected status",
        getDetailedPersonRes8.status,
        getDetailedPersonBody8
      );
      throw new Error();
    }

    if (getDetailedPersonBody8.person.schedule.length - newPerson2Tasks != 1) {
      console.error(
        "Expected 1 new scheduled task for person2, got",
        getDetailedPersonBody8.person
      );
      throw new Error();
    }

    // Go 7h into the future so that task 2 is overdue and penalised

    timeProvider.advance(ms("7h"));
    await new Promise((r) => setTimeout(r, 1000));

    // The person that did not mark the second task done should have a penalised completed task

    const penalisedCompletedTask = await fetch(
      `http://localhost:9999/v1/person/${houseId}/${personIdWhoHasToDoTask2}`,
      {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      }
    );

    const penalisedCompletedTaskBody = await penalisedCompletedTask.json();

    if (penalisedCompletedTask.status != 200) {
      console.error(
        "Got unexpected status",
        penalisedCompletedTask.status,
        penalisedCompletedTaskBody
      );
      throw new Error();
    }

    if (penalisedCompletedTaskBody.person.historicalTasks.length != 1) {
      console.error(
        "Expected 1 historical task, got",
        penalisedCompletedTaskBody.person.historicalTasks.length,
        penalisedCompletedTaskBody
      );
      throw new Error();
    }

    if (!penalisedCompletedTaskBody.person.historicalTasks[0].isPenalised) {
      console.error(
        "Expected a penalised completed task, got",
        penalisedCompletedTaskBody.person.historicalTasks[0],
        penalisedCompletedTaskBody
      );
      throw new Error();
    }

    // Cleanup

    await createHouseWithThreePeopleAtom.teardown(
      createHouseWithThreePeopleAtomData
    );
  },
};
