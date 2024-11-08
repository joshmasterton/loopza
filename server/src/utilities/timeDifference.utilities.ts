export const formatTimeDifference = (date: Date) => {
  const now = new Date();
  const differenceInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    return `Just now`;
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes}m`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours}h`;
  } else if (differenceInSeconds < 604800) {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days}d`;
  } else {
    const weeks = Math.floor(differenceInSeconds / 604800);
    return `${weeks}w`;
  }
};
