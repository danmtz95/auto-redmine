import axios from 'axios';
import fs from 'fs';
import {apiKey, api} from './config.js';

console.log(`${api}/time_entries.json`);
console.log(`${api}/issues.json`);
const headers = {
    'Content-Type': 'application/json',
    'X-Redmine-API-Key': apiKey,
};
const issueIdToGet = 29002;
const response = await axios.get(`${api}/issues/${issueIdToGet}.json`, { headers });