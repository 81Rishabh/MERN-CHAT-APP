import {io} from 'socket.io-client';
// const ENDPOINT = 'http://localhost:8080';
const PRODUCT_ENDPOINT = 'https://chitchat-nio0.onrender.com';

export const socket = io(PRODUCT_ENDPOINT);