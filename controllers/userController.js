export const userRegistration = async (req, res) => {
  const { email, password } = req.body;
  return res.status(200).json(req.body);
};

export const getUser = async (req, res) => {
  res.status(200).json({ msg: "Hello" });
};
