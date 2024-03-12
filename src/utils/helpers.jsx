export const isValidImageURL = async (imageURL) => {
  try {
    const res = await fetch(imageURL);
    if (res.status === 200) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
