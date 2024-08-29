const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList } = require('graphql');
const User = require('./models/User');
const Wallet = require('./models/Wallet');

// Define the UserType
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  })
});

// Define the WalletType
const WalletType = new GraphQLObjectType({
  name: 'Wallet',
  fields: () => ({
    id: { type: GraphQLID },
    walletName: { type: GraphQLString },
    publicKey: { type: GraphQLString },
    privateKey: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      }
    }
  })
});

// Define the RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    wallet: {
      type: WalletType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Wallet.findById(args.id);
      }
    },
    wallets: {
      type: new GraphQLList(WalletType),
      resolve(parent, args) {
        return Wallet.find({});
      }
    }
  }
});

// Define the Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addWallet: {
      type: WalletType,
      args: {
        walletName: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(parent, args) {
        const wallet = new Wallet({
          walletName: args.walletName,
          userId: args.userId,
          publicKey: "generated_public_key",  // Placeholder for real key generation logic
          privateKey: "generated_private_key" // Placeholder for real key generation logic
        });
        return wallet.save();
      }
    },
    deleteWallet: {
      type: WalletType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Wallet.findByIdAndRemove(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});