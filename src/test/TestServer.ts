import { createServer, Server as HttpServer } from 'http';

import express from 'express';
import passport from 'passport';
import supertest from 'supertest';

afterAll(async () => {
  await testServer.close();
});

beforeAll(async () => {
  await testServer.init();
});

beforeEach(() => {
  jest.clearAllMocks();
});

const isAuthorized = () => (req: any, res: any, next: any) => {
  try {
    return passport.authenticate('dynamicStrategy', {
      session: false,
      failWithError: true,
    })(req, res, next);
  } catch (err) {
    return next(err);
  }
};

class Server {
  private readonly expressApp: express.Application = express();

  public constructor() {
    this.expressApp.get(
      '/user',
      isAuthorized(),
      function (req, res) {
        res.status(200).json(req.user);
      },
      function (err: any, _req: any, res: any, next: any) {
        const status = err.status || 500;
        const errorMessage = err.message;

        res.status(status);

        res.json({
          error: errorMessage,
          status,
        });

        next();
      },
    );
  }

  public get app(): express.Application {
    return this.expressApp;
  }
}

export default Server;

class TestServer {
  private testApp!: express.Application;

  private testServer!: HttpServer;

  private Klass: typeof Server;

  public constructor(cls = Server) {
    this.Klass = cls;
  }

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this.testServer);
  }

  public async init(): Promise<void> {
    this.testApp = new this.Klass().app;
    this.testServer = createServer(this.testApp);
  }

  public async close(): Promise<void> {
    await this.testServer.close();
  }
}

export const testServer: TestServer = new TestServer();
