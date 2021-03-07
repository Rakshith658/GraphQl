const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const{
    GraphQLSchema ,
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLInt
} = require('graphql');

// npm run devstart //


const app =express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType =new GraphQLObjectType({
    name:'Book',
    description:'books written by the author',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        author:{
            type:AuthorType,
            resolve:(book)=>{
                return authors.find(author=>author.id===book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        books:{
            type:new GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(book=>book.authorId===author.id)

            }
        }
    })
}) 

const RootQueryType=new GraphQLObjectType({
    name:'Query',
    description:'list of Books',
    fields:()=>({
        book:{
            type:BookType,
            description:"list of all the book",
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return books.find(book=> book.id===args.id)
            }
        },
        author:{
            type:AuthorType,
            description:"list of all the book",
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return authors.find(author=> author.id===args.id)
            }
        },
        books:{
            type:new GraphQLList(BookType),
            description:"list of all the books",
            resolve:()=>books,
        },
        authors:{
            type:new GraphQLList(AuthorType),
            description:"list of all the books",
            resolve:()=>authors,
        }
    })
})

const RootMutation=new GraphQLObjectType({
    name:'Mutation',
    description:"adding the book to the list",
    fields:()=>({
        addbook:{
            type:BookType,
            description:"add the book",
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const book={id: books.length + 1,name:args.name,authorId:args.authorId}
                books.push(book)
                return book
            }
        },
        addauthor:{
            type:AuthorType,
            description:"add author",
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                // authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parent,args)=>{
                const author={id: authors.length + 1,name:args.name}
                authors.push(author)
                return author
            }
        },
    })
})

const Schema=new GraphQLSchema({
    query:RootQueryType,
    mutation:RootMutation,
    
})
// const Schema=new GraphQLSchema({
//     query:new GraphQLObjectType({
//         name:"Helloworld",
//         fields:() => ({
//             message: {
//                 type:GraphQLString,
//                 resolve:()=>'Rakshith Kumar s'
//             }
//         })
//     })
// })

app.use('/graphQL',graphqlHTTP({
    schema:Schema, 
    graphiql:true,
}))
const PORT=3000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
