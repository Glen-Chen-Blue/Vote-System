const data = [
    {
      id: 1,
      title: '投票1',
      description: '這是投票1的描述',
      options: [{ option: '選項1'}, { option: '選項2'}],
      active: true,
      endTime: '2023-12-31',
    },
    {
      id: 2,
      title: '投票2',
      description: '這是投票2的描述',
      options: [{ option: '選項1', votes: 30 }, { option: '選項2', votes: 40 }, { option: '選項3', votes: 50 }],
      active: false,
      endTime: '2023-05-31',
    },
    {
        id: 3,
        titl: '投票3',
        description:'這是投票3的描述',
        options: [{ option: '項1'}, { option: '選項2'}],
        active: true,
        endTime: '2023-12-31',
      },
      {
        id: 4,
        title: '投票4',
        description: '這是投票4的描述',
        options: [{ option: '選項1', votes: 30 }, { option: '選項2', votes: 40 }, { option: '選項3', votes: 50 }],
        active: false,
        endTime: '2023-05-31',
      },
  ];
export default data;