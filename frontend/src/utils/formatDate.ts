export const dateStringToLocalTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
