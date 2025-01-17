const COOLDOWN_TIME = 5 * 60 * 1000;

const checkUpdateCooldown = async (platform: string) => {
  const key = `${platform}LastUpdated`;
  const result = await chrome.storage.local.get(key);
  const lastUpdated = result[key];

  if (!lastUpdated) return { canUpdate: true };

  const lastUpdateTime = new Date(lastUpdated).getTime();
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - lastUpdateTime;
  const cooldownTime = COOLDOWN_TIME;

  if (timeElapsed < cooldownTime) {
    const remainingTime = cooldownTime - timeElapsed;
    const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));

    return {
      canUpdate: false,
      message: `${remainingMinutes}분 후에 다시 시도할 수 있습니다.`,
    };
  }

  return { canUpdate: true };
};

export default checkUpdateCooldown;
