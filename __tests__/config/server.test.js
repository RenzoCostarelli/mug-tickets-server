/*const request = require('supertest');
require('dotenv').config();
const Server =  require('./../../src/config/server');
const server = new Server();

beforeAll(async () => {
  await server.listen();
});

afterAll(() => {
  server.stop();
});

describe('Server', () => {

  describe('constructor', () => {

    test('should create a new instance', () => {
      expect(server).toBeDefined();
      expect(server).toBeInstanceOf(Server);
    });

    test('should set default values', () => {     
      console.log(server.app.path()) 
      expect(server.app).toBeDefined();
      expect(server.port).toBe('8080');
    });

    test('should set provided values', () => {

      //expect(server.host).toBe('127.0.0.1');
      expect(server.port).toBe('8080');
      //expect(server.env).toBe('production');
    });

  });

  describe('start', () => {
    test('should start the server', () => {

      expect(server.app).toBeDefined();
      //expect(server.app.listening).toBe(true);

    });
  });

  describe('stop', () => {
    test('should stop the server',  () => {      
      //server.app.stop();
      //expect(server.app).toBeUndefined();
    });
  });
});

const { MongoClient } = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('DB should be defined', () => {
    expect(db).toBeDefined();
    expect(connection).toBeInstanceOf(MongoClient);
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    
    const mockUser = {
      _id: 'some-user-id', 
      name: 'John'
    };
    await users.insertOne(mockUser);
    
    const insertedUser = await users.findOne({
      _id: 'some-user-id'
    });
    expect(insertedUser).toEqual(mockUser);
  });
});*/

////////////////////////////////////////////
import express from 'express';
import { Server } from '../../src/config/server.js';
import { Database } from '../../src/config/db.js';

// Mocking Database class
jest.mock('./../../src/config/db', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connectDB: jest.fn()
    };
  });
});

describe('Server', () => {
  let server;

  beforeEach(() => {
    // Clear all instances and calls to the mock Database class
    Database.mockClear();

    // Create a new instance of the Server class for each test
    server = new Server();
  });

  it('should create a Server instance with default values', () => {
    expect(server).toBeDefined();
    //expect(server.dataBase).toBeInstanceOf(Database);
    expect(server.port).toBe(process.env.PORT);
    expect(server.app).toBeDefined();
  });

  it('should create a Server instance with custom values', () => {
    const customPort = '3000';
    const customApp = express();
    const customDatabase = new Database();

    const customServer = new Server(customDatabase, customPort, customApp);

    expect(customServer).toBeDefined();
    expect(customServer.dataBase).toBe(customDatabase);
    expect(customServer.port).toBe(customPort);
    expect(customServer.app).toBe(customApp);
  });

  it('should call connectDB when creating a new Server instance', () => {
    expect(Database).toHaveBeenCalledTimes(1); // One instance of Database should be created
    //expect(Database.mock.instances[0].connectDB).toHaveBeenCalledTimes(1); // connectDB should be called once
  });

  it('should set up cors middlewares', () => {
    // Mock express methods
    const useMock = jest.spyOn(server.app, 'use');

    // Call the middlewares method
    server.corsMiddleware();

    // Expect express methods to have been called with the appropriate middleware functions
    //expect(useMock).toHaveBeenCalledWith(cors());
    expect(useMock).toHaveBeenCalled();
  });

  it('should set up parser middlewares', () => {
    // Mock express methods
    const useMock = jest.spyOn(server.app, 'use');

    // Call the middlewares method
    server.parserMiddleware();

    // Expect express methods to have been called with the appropriate middleware functions
    expect(useMock).toHaveBeenCalled();
  });
});