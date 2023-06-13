let polls = [
  {
    id: 1,
    title: "投票1",
    description: "這是投票1的描述",
    options: ["a", "b"],
    active: true,
    endTime: "2023-12-31",
    lastBlockID: 0,
  },
];

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

export { createPoll, modifyLastID, getPoll };
