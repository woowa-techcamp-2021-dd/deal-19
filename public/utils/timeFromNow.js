function timeFromNow (time) {
  if (isNaN(new Date(time).getTime())) {
    return '';
  }
  const now = new Date().getTime();

  const minuteDifference = Math.floor((now - time) / 1000 / 60);
  if (minuteDifference < 1) return '방금 전';
  if (minuteDifference < 60) return `${minuteDifference}분 전`;

  const hourDifference = Math.floor(minuteDifference / 60);
  if (hourDifference < 24) return `${hourDifference}시간 전`;

  const dayDifference = Math.floor(hourDifference / 24);
  if (dayDifference < 7) return `${dayDifference}일 전`;

  const weekDifference = Math.floor(dayDifference / 7);
  return `${weekDifference}주 전`;
}

export default timeFromNow;
