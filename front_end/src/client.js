import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url'


export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  appVersion: "2023-12-27", // Specify the API version
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
  apiVersion: '2023-12-27', // Add the API version here
});



const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);