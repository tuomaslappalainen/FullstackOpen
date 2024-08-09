const Blog = require('../models/blog')
const User = require('../models/user')

const exampleUsers = [
  {
    username: "yksi",
    name: "ykkönen",
    password: "salainen"
  },
  {
    username: "Mies",
    name: "Man",
    password: "qwerty123"
  },
  {
    username: "bwayne",
    name: "Bruce Wayne",
    password: "abc123xyz"
  },
  {
    username: "rj89",
    name: "Rachel Johnson",
    password: "password123"
  },
  {
    username: "mk1",
    name: "M King",
    password: "itjtj"
  },
  {
    username: "lturner02",
    name: "Laura Turner",
    password: "ilovecoding"
  }
]

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogsListAll = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  const result = blogs.find(blog => blog.likes === maxLikes)
  
  return JSON.stringify({ author: result.author, likes: result.likes })
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  const maxBlogs = Math.max(...Object.values(blogCounts))
  const result = Object.entries(blogCounts).find(([_, count]) => count === maxBlogs)

  return result ? JSON.stringify({ author: result[0], blogs: result[1] }) : null
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  exampleUsers,
  listWithOneBlog,
  blogsListAll,
  dummy,
  totalLikes,
  mostLikes,
  favoriteBlog,
  mostBlogs,
  usersInDb,
}