const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query
require("dotenv").config()

  var client = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET,
  })

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo{
      id: ID!
      value: String!
      done: Boolean!
  }
  type Mutation{
      addTodo(value: String!):Todo
      updateTodoDone(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: async (parent, args, {user}) => {
      if (!user){
        return [];
      }
      else{

        try{
        
        const results = await client.query(
          q.Paginate(q.Match(q.Index("12cIndex"), user))
      )

      return results.data.map(([ref,value,done])=>({
        id: ref.id,
        value,
        done
      }))

    }
    catch(e){

      return e.toString() 
    }



    }



    }
  },
  Mutation:{
      addTodo: async (_,{value},{user})=>{

        if (!user){
          throw new Error ("Must be authenticated to insert todos")
        }
        
        const results = await client.query(
          q.Create(q.Collection("12cCollection"),{
          data:{
              value: value,
              done: false,
              owner: user
          } 
          })
      );


        return ({
          ...results.data,
          id: results.ref.id
        }
        )
      },
      updateTodoDone: async (_,{id}, {user})=>{

        if (!user){
          throw new Error ("Must be authenticated to update todos")
        }

        const results = await client.query(
          q.Update(q.Ref(q.Collection("12cCollection"),id),
          {
          data:{
              done:true
          }
      }
          )
      )

      return (
        {
          ...results.data,
          id: results.ref.id
        }
      )

      }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({context})=>{
    if (context.clientContext.user){
      return(
        {
          user: context.clientContext.user.sub
        }
      )
    }

    else{
      return {};
    }
    
  },
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();