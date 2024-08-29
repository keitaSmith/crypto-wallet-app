const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const marketDataRoutes = require('./routes/marketDataRoutes'); 
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); // Import the GraphQL schema

const app = express();
app.use(express.json())
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // Enables the GraphiQL interface, a GraphQL IDE
  }));

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api', walletRoutes); // Wallet routes
app.use('/api', marketDataRoutes);
module.exports = app;