import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/customer-accounts`;

test.describe('Customer Accounts API', () => {
  let createdAccountId: number;

  test('should create a new customer account', async ({ request }) => {
    const response = await request.post(API_BASE, {
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.accountId).toBeDefined();
    expect(body.firstName).toBe('John');
    expect(body.lastName).toBe('Doe');
    expect(body.email).toBe('john.doe@example.com');
    expect(body.phoneNumber).toBe('1234567890');
    expect(body.dateCreated).toBeDefined();

    createdAccountId = body.accountId;
  });

  test('should return validation error for invalid email', async ({
    request,
  }) => {
    const response = await request.post(API_BASE, {
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should return validation error for missing required fields', async ({
    request,
  }) => {
    const response = await request.post(API_BASE, {
      data: {
        firstName: 'John',
        // Missing lastName and email
      },
    });

    expect(response.status()).toBe(400);
  });

  test('should return conflict error for duplicate email', async ({
    request,
  }) => {
    const email = `duplicate-${Date.now()}@example.com`;

    // Create first account
    const firstResponse = await request.post(API_BASE, {
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: email,
      },
    });
    expect(firstResponse.status()).toBe(201);

    // Try to create second account with same email
    const secondResponse = await request.post(API_BASE, {
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: email,
      },
    });

    expect(secondResponse.status()).toBe(409);
  });

  test('should retrieve all customer accounts', async ({ request }) => {
    const response = await request.get(API_BASE);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should retrieve a single customer account by ID', async ({
    request,
  }) => {
    // First create an account
    const createResponse = await request.post(API_BASE, {
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: `jane-${Date.now()}@example.com`,
      },
    });
    const createdAccount = await createResponse.json();
    const accountId = createdAccount.accountId;

    // Then retrieve it
    const getResponse = await request.get(`${API_BASE}/${accountId}`);
    expect(getResponse.status()).toBe(200);
    const body = await getResponse.json();
    expect(body.accountId).toBe(accountId);
    expect(body.firstName).toBe('Jane');
  });

  test('should return 404 for non-existent account', async ({ request }) => {
    const nonExistentId = 999999;
    const response = await request.get(`${API_BASE}/${nonExistentId}`);

    expect(response.status()).toBe(404);
  });

  test('should update a customer account', async ({ request }) => {
    // First create an account
    const createResponse = await request.post(API_BASE, {
      data: {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: `bob-${Date.now()}@example.com`,
      },
    });
    const createdAccount = await createResponse.json();
    const accountId = createdAccount.accountId;

    // Then update it
    const updateResponse = await request.patch(`${API_BASE}/${accountId}`, {
      data: {
        firstName: 'Robert',
        city: 'Los Angeles',
      },
    });

    expect(updateResponse.status()).toBe(200);
    const body = await updateResponse.json();
    expect(body.firstName).toBe('Robert');
    expect(body.city).toBe('Los Angeles');
    expect(body.lastName).toBe('Johnson'); // Should remain unchanged
  });

  test('should return validation error for invalid update data', async ({
    request,
  }) => {
    // First create an account
    const createResponse = await request.post(API_BASE, {
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
      },
    });
    const createdAccount = await createResponse.json();
    const accountId = createdAccount.accountId;

    // Try to update with invalid email
    const updateResponse = await request.patch(`${API_BASE}/${accountId}`, {
      data: {
        email: 'invalid-email',
      },
    });

    expect(updateResponse.status()).toBe(400);
  });

  test('should delete a customer account', async ({ request }) => {
    // First create an account
    const createResponse = await request.post(API_BASE, {
      data: {
        firstName: 'Delete',
        lastName: 'Me',
        email: `delete-${Date.now()}@example.com`,
      },
    });
    const createdAccount = await createResponse.json();
    const accountId = createdAccount.accountId;

    // Then delete it
    const deleteResponse = await request.delete(`${API_BASE}/${accountId}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify it's deleted
    const getResponse = await request.get(`${API_BASE}/${accountId}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 when deleting non-existent account', async ({
    request,
  }) => {
    const nonExistentId = 999999;
    const response = await request.delete(`${API_BASE}/${nonExistentId}`);

    expect(response.status()).toBe(404);
  });
});

