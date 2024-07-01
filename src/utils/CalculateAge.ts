export function calculateAge(birth: string | undefined) {
  if (!birth) return "未登録";
  
  const birthDate = new Date(birth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // 현재 월이 태어난 월보다 작을 때 or 월은 같고 일이 작을 때
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  if (age > 0) {
    // 나이가 1살 이상일 때
    return `${age}살`;
  } else {
    // 나이가 1살 미만일 경우
    let month = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (dayDifference < 0) {
      month--;
    }
    if (month > 0) {
      return `${month}개월`;
    } else {
      // 1개월 미만일 경우
      const oneDay = 1000 * 60 * 60 * 24; // 하루 -> 밀리초 변환
      const days = Math.floor((today.getTime() - birthDate.getTime()) / oneDay);
      return `${days}일`;
    }
  }
}
