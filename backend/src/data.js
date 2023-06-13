import coutingVotes from "./iota/coutingVotes";

let polls = [
  {
    id: "POLL_0PresidentOfDepartment_",
    title: "DEPARTMENT PRESIDENT",
    description: "Choose next year's EE Department President",
    options: [
      { option: "TSAI", votes: 97 },
      { option: "LEE", votes: 103 },
    ],
    active: false,
    endTime: "2023-05-24T19:00",
    lastBlockID: 0,
  },
];

let latestEnd = {
  latestID: 0,
  latestTime: 1000000000000000,
};

function createPoll(title, description, options, endTime) {
  let choices = [];
  options.forEach((option) => choices.push({ option, votes: -1 }));
  const newPoll = {
    id: "POLL_" + polls.length.toString() + title + "_",
    title,
    description,
    options: choices,
    active: true,
    endTime,
    lastBlockID: 0,
  };
  polls.push(newPoll);
  console.log(polls);
  if (new Date(latestEnd.latestTime) > new Date(endTime)) {
    console.log("LATER");
    latestEnd = {
      latestID: newPoll.id,
      latestTime: endTime,
    };
  }
  return newPoll.id;
}

function modifyLastID(poll_ID, lastBlockID) {
  polls = polls.map((d) => {
    d.id === poll_ID
      ? (d.lastBlockID = lastBlockID)
      : (d.lastBlockID = d.lastBlockID);
    return d;
  });
  // console.log("modify: ", polls);
}

function getPoll(poll_ID) {
  // console.log("GET:", polls);
  return polls.filter((d) => d.id === poll_ID)[0];
}

function getAllPoll() {
  return polls;
}

function getLatest() {
  return latestEnd;
}

function initializeLatest() {
  latestEnd.latestTime = 1000000000000000;
  latestEnd.latestID = 0;
  polls.forEach((poll) => {
    if (poll.active) {
      if (latestEnd.latestTime > new Date(poll.endTime)) {
        latestEnd.latestID = poll.id;
        latestEnd.latestTime = new Date(poll.endTime);
      }
    }
  });
  console.log("next open:", latestEnd.latestID);
}

async function endPoll() {
  // while (true) {
  //   console.log("currentTime:", new Date());
  //   setTimeout(endPoll(), 1000);
  // }
  let currentTime = new Date();
  console.log(currentTime);
  console.log(latestEnd.latestTime);
  if (
    new Date(latestEnd.latestTime) < new Date(currentTime) &&
    latestEnd.latestID
  ) {
    const poll_ID = latestEnd.latestID;
    polls = polls.map((d) => {
      if (d.id === poll_ID) {
        d.active = false;
      }
      return d;
    });
    console.log(polls);
    initializeLatest();
    console.log("end", poll_ID);
    let result = await coutingVotes(poll_ID);
    polls = polls.map((d) => {
      if (d.id === poll_ID) {
        d.options = result;
        d.active = false;
      }
      return d;
    });
    console.log(poll_ID, getPoll(poll_ID).options);
  }
  // await sleep(1000);
}
export {
  createPoll,
  modifyLastID,
  getPoll,
  getAllPoll,
  getLatest,
  initializeLatest,
  endPoll,
};
