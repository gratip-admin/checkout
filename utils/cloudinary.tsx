// utils/cloudinary.js
export const getCloudinaryUrl = (publicId: string, transformations = "") => {
  const cloudName = "dcvd8wel9"; 
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
};
