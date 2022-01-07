import axios from "axios";

const baseUrl = process.env.REACT_APP_URL_API;
const notesApi = baseUrl + "/notes";

const getAllNotes = () => {
  return axios.get(notesApi).then((res) => res.data);
};

const postNotes = (note) => {
  return axios.post(notesApi, note).then((res) => res.data);
};

const updateNote = (id, note) => {
  return axios.put(`${notesApi}/${id}`, note).then((res) => res.data);
};

export const http = {
  getAllNotes,
  postNotes,
  updateNote,
};
