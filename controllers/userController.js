export const userRegistration = async (req, res, err, next) => {
  const { email, password } = req.body;
  console.log(email);
};
