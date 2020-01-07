import {addSeconds, format} from "date-fns";

export function getenv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error('Missing required env variable');
  }
  return value;
}

export function getAudioStreamUrl(fileId: string) {
  const accessToken = localStorage.getItem('token');
  return `${getenv('REACT_APP_API_URL')}/sounds/stream/${fileId}?accessToken=${accessToken}&key=${getenv('REACT_APP_GOOGLE_DEVELOPER_KEY')}`;
}

export function getFormattedDuration(seconds: number) {
  return seconds ? format(addSeconds(new Date(0), seconds), 'mm:ss') : '00:00';
}

export function getAudioDom(): HTMLAudioElement|null {
  const audioDom = document.getElementById('main-audio');
  if (audioDom instanceof HTMLAudioElement) {
    return audioDom;
  }
  return null;
}

export function alphabeticalSort(a: string, b: string) {
  return a.localeCompare(b);
}
