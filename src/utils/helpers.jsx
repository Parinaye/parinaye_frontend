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


export const capitalizeWord = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}