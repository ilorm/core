module.exports = {
  base: {
    model: true,
    modelId: true,
  },
  operations: {
    count: true,
    find: true,
    remove: true,
    stream: true,
    update: true,
    updateOne: true,
  },
  query: {
    linkedWith: true,
    number: true,
    or: true,
    pagination: true,
    select: true,
    sorting: true,
  },
  extra: {
    transaction: true,
  },
};
