import { createAsyncThunk } from '@reduxjs/toolkit';
import { PostRequest, GetRequest } from '../../apis/config';

export const addDoctor = createAsyncThunk('admin/addDoctor', async (data) => {
  return await PostRequest('/admin/add-doctor', data);
});

export const addPatient = createAsyncThunk('admin/addPatient', async (data) => {
  return await PostRequest('/admin/add-patient', data);
});

export const fetchLists = createAsyncThunk('admin/fetchLists', async () => {
  return await GetRequest('/admin/lists');
});
