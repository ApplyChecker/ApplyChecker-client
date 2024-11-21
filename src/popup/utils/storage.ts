const getUserIdFromStorage = (): string | null => {
  try {
    const userIdKey = Object.keys(localStorage).find((key) =>
      key.startsWith("ab.storage.userId"),
    );
    if (!userIdKey) return null;
    const storageValue = localStorage.getItem(userIdKey);
    if (!storageValue) return null;
    const parsed = JSON.parse(storageValue);
    return parsed?.v?.g || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export default getUserIdFromStorage;
