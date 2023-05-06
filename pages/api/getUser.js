import axios from 'axios';

export async function getUser() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');

  console.log(respone.data);
  return response.data;
}