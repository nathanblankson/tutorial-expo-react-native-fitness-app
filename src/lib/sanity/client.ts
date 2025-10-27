import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Client safe config
const config = {
    projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.EXPO_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.EXPO_PUBLIC_SANITY_API_VERSION,
    useCdn: false,
}
export const client = createClient(config);

// Admin level client, used for backend, e.g. for mutations
const adminConfig = {
    ...config,
    token: process.env.SANITY_API_TOKEN,
}
export const adminClient = createClient(adminConfig);

// Image URL builder
const builder = imageUrlBuilder(config);
export const urlFor = (source: string) => builder.image(source);
