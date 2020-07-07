const { User, Beer } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = require("../constants");

const resolvers = {
  Query: {
    async current(_, args, { user }) {
      if (user) {
        return await User.findOne({ where: { id: user.id } });
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
    async beer(_, { name }, { user }) {
      if (user) {
        const beer = await Beer.findOne({ where: { name: name } });
        return beer;
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
    async beers(_, { brand }, { user }) {
      if (user) {
        const beers = await Beer.findAll({ where: { brand: brand } });
        return beers;
      }
      throw new Error("Sorry, you're not an authenticated user!");
    },
  },
  Mutation: {
    async register(_, { login, password }) {
      const user = await User.create({
        login,
        password: await bcrypt.hash(password, 10),
      });
      return jsonwebtoken.sign({ id: user.id, login: user.login }, JWT_SECRET, {
        expiresIn: "3m",
      });
    },
    async login(_, { login, password }) {
      const user = await User.findOne({ where: { login } });

      if (!user) {
        throw new Error("User does not exist");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("You password is incorrect!");
      }

      return jsonwebtoken.sign({ id: user.id, login: user.login }, JWT_SECRET, {
        expiresIn: "1d",
      });
    },
    async newBeer(_, { brand, name, price }) {
      const beer = await Beer.create({
        brand,
        name,
        price,
      });
      return "Beer created succesfully";
    },
  },
};

module.exports = resolvers;
