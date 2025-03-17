export function getNow() {
  return new Date().toISOString();
}

export function convertDateStringToTimeStamp(timeString: string) {
  return new Date(timeString).toISOString();
}