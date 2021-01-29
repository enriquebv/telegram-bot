import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://covid-api.mmediagroup.fr/v1'
});

export const getDataByCountry = country => {
  return instance.get(`/cases?country=${country}`);
}

export const getAllCountries = async () => {
  const response = await instance.get(`/cases`);
  return Object.keys(response.data);
}