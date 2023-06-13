import coutingVotes from "./iota/coutingVotes";

let polls = [
  // {
  //   id: 1,
  //   title: "投票1",
  //   description: "這是投票1的描述",
  //   options: ["a", "b"],
  //   active: true,
  //   endTime: "2023-12-31",
  //   lastBlockID: 0,
  // },
];

let latestEnd = {
  latestID: 0,
  latestTime: 1000000000000000,
};

function createPoll(title, description, options, endTime) {
  const newPoll = {
    id: "POLL_" + polls.length.toString() + title + "_",
    title,
    description,
    options,
    active: true,
    endTime,
    lastBlockID: 0,
  };
  polls.push(newPoll);
  console.log(polls);
  if (latestEnd.latestTime > new Date(endTime)) {
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
  polls.forEach((poll) => {
    if (poll.active) {
      if (latestTime > new Date(poll.endTime)) {
        latestEnd.latestID = poll.poll_ID;
        latestEnd.latestTime = new Date(poll.endTime);
      }
    }
  });
}

async function endPoll() {
  // while (true) {
  //   console.log("currentTime:", new Date());
  //   setTimeout(endPoll(), 1000);
  // }
  let currentTime = new Date();
  if (latestEnd.latestTime < currentTime) {
    let result = await coutingVotes(latestEnd.latestID);
    polls = polls.map((d) => {
      if (d.id === poll_ID) {
        d.options = result;
        d.active = false;
      }
      return d;
    });
    initializeLatest();
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
