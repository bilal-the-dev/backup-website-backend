export const sendResponse = (req, res, data, status) => {
  // const {
  //   discordUser,
  //   query: { fields },
  // } = req;

  // const fieldArray = fields?.split(",");

  // if (fieldArray?.includes("user")) data = { discordUser, [fieldName]: data };

  if (status) res.status(status);
  res.send({
    status: "success",
    data,
  });
};
