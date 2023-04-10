exports.getProtectedData = async (req, res) => {
  try {
    // Access the user object from the request
    const user = req.user;
    
    // Get protected data for the user
    const protectedData = await getDataForUser(user);
    
    // Return the protected data to the user
    res.json(protectedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};