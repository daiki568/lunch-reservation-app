export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const formatDateJP = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
};

export const formatDateWithDay = (dateString: string): string => {
  return `${formatDateJP(dateString)} (${getDayOfWeek(dateString)})`;
};