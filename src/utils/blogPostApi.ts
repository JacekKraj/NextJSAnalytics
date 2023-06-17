const API_URL = "https://jsonplaceholder.typicode.com";

export const getPosts = () => fetch(`${API_URL}/posts`).then((json) => json.json());

export const getPost = (id: string) => fetch(`${API_URL}/posts/${id}`).then((json) => json.json());
