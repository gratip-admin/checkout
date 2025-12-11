export const removeEmptyProperties = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== "" && value !== null)
  );
