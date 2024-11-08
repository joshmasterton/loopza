export const calculateOnline = (lastOnline: Date | string) => {
  const now = new Date();
  console.log(lastOnline);
  const lastOnlineDate = new Date(lastOnline);
  return (now.getTime() - lastOnlineDate.getTime()) / 1000 <= 60;
};
