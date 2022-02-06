import axios from "axios";
import { notesApi } from "../utils/url";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAllNotes = () => {
  return axios.get(notesApi).then((res) => res.data);
};

const postNotes = async (note) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(notesApi, note, config);
  return response.data;
};

const updateNote = (id, note) => {
  return axios.put(`${notesApi}/${id}`, note).then((res) => res.data);
};

const deleteNote = (id) => {
  return axios.delete(`${notesApi}/${id}`).then((res) => res.data);
};

export default {
  getAllNotes,
  postNotes,
  updateNote,
  deleteNote,
  setToken,
};
