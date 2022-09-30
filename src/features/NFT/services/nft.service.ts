export const writeMetadata = async (collectionId: string, id: string, data: any) => {
  return fetch(`/api/metadata/${collectionId}/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
