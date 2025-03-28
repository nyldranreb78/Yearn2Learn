import http from 'k6/http';
import { sleep, check } from 'k6';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

export const options = {
  stages: [
    // { duration: '10s', target: 10 }, // below normal load
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 100 },  // Stay at 100 users for 1 minute
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],   // 99% of requests must succeed
  },
};

function testAuth() {
  const BASE_URL = 'http://localhost:3000/api/auth'
  const email = 'test2@email.com';
  const password = 'test345';

  let authToken;

  describe("Login the website", () => {
    const url = `${BASE_URL}/login`;
    const payload = JSON.stringify({
      email: email,
      password: password
    });

    const res = http.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'is authenticated': (r) => r.json().access_token !== '',
    });

    authToken = res.json().access_token;
    sleep(1);
  });


  describe("Logout user", () => {
    const url = `${BASE_URL}/logout`;
    const res = http.post(url, 
      {
        authorization: `Bearer ${authToken}`,
      }
    );

    check(res, {
      'status is 204': (r) => r.status === 204,
    });
    sleep(1);
  });
}

function testNotepad() {
  const BASE_URL = 'http://localhost:3000/api'
  const email = 'test2@email.com';
  const password = 'test345';

  let authToken;
  
  // Login
  const payload = JSON.stringify({
    email: email,
    password: password
  });
  
  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  authToken = res.json().access_token;

  // Get all notes/folders
  describe("Get all folders", () => {
    const res = http.get(`${BASE_URL}/folder`, {
      headers: {
          authorization: `Bearer ${authToken}`,
      }
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'folders are returned': (r) => r.json().folders != null,
    });
    sleep(1);
  });

  // Get all notes 
  describe("Get all notes", () => {
    const res = http.get(`${BASE_URL}/note`, {
      headers: {
        authorization: `Bearer ${authToken}`,
      }
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'notes are returned': (r) => r.json().notes != null,
    });
  });

  // Create a new note
  describe("Create a new note", () => {
    const payload = JSON.stringify({
      title: 'Test Note',
      content: 'This is a test note',
    });

    const res = http.post(`${BASE_URL}/note/create`, payload, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    check(res, {
      'status is 201': (r) => r.status === 201,
      'note is created': (r) => r.json().note != null,
    });
  });
}

function testTask() {
  const BASE_URL = 'http://localhost:3000/api';
  const email = 'test2@email.com';
  const password = 'test345';

  let authToken;

  // Login
  const payload = JSON.stringify({
    email: email,
    password: password
  });

  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  authToken = res.json().access_token;

  // Get all tasks
  describe("Get all tasks", () => {
    const res = http.get(`${BASE_URL}/task`, {
      headers: {
        authorization: `Bearer ${authToken}`, 
      }
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'tasks are returned': (r) => r.json().tasks != null,
    });
  });

  // Create a new task
  describe("Create a new task", () => {
    const payload = JSON.stringify({
      name: 'Test Task',
      deadline: new Date('2030-12-31').toISOString(),
    });

    const res = http.post(`${BASE_URL}/task/create`, payload, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authToken}`,
      },
    });

    check(res, {
      'status is 201': (r) => r.status === 201,
      'task is created': (r) => r.json().task != null,
    });
  });
}

function testFlashcards() {
  const BASE_URL = 'http://localhost:3000/api';
  const email = 'test2@email.com';
  const password = 'test345';

  let authToken;

  // Login
  const payload = JSON.stringify({
    email: email,
    password: password
  });

  const res = http.post(`${BASE_URL}/auth/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  authToken = res.json().access_token;

  // Get all flashcards
  describe("Get all flashcards", () => {
    const res = http.get(`${BASE_URL}/flashcard`, {
      headers: {
        authorization: `Bearer ${authToken}`,
      }
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'flashcards are returned': (r) => r.json().flashcards != null,
    });
  });

  // Create a new flashcard
  describe("Create a new flashcard", () => {
    const payload = JSON.stringify({
      question: 'Test Question',
      answer: 'Test Answer',
      setName: 'Test Set',
      author: 'Test Author',
    });

    const res = http.post(`${BASE_URL}/flashcard/`, payload, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authToken}`,
      },
    });

    console.log(res.body);

    check(res, {
      'status is 201': (r) => r.status === 201,
    });
  });
}

export default function testSuite() {
  testAuth();
  testNotepad();
  testTask();
  testFlashcards();

}