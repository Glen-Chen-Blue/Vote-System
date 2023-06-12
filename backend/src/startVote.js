function startVote(title, description, options, endTime) {
  return {
    id: 1,
    title,
    description,
    choices: options,
    active: true,
    endTime,
    lastBlockID: "0",
  };
}

export default startVote;
