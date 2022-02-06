import axios from "axios";
import { notesApi } from "../utils/url";

const getAllNotes = () => {
  return axios.get(notesApi).then((res) => res.data);
};

const postNotes = (note) => {
  return axios.post(notesApi, note).then((res) => res.data);
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
};
