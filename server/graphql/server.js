
import { Router } from 'express';
import graphQLHTTP from 'express-graphql';
import { sequelizeAuthMiddleware } from '../middleware/auth';
import schema from './data/schema';

const GraphQLRouter = Router();

const PORT = 4000;

const GraphQLServer = graphQLHTTP({
  schema,
  graphiql: true,
  pretty: true,
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
});

// Reusing auth middleware as the server is exposed the same way an API would.
GraphQLRouter.all('*', sequelizeAuthMiddleware, GraphQLServer);

export default GraphQLRouter;

