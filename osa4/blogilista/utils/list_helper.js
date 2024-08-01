const _= require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes  = array => {
   let sum = 0
    array.forEach(element => {
        sum += element.likes
    })
    return sum
  }

  const favoriteBlog  = array => {
    const favorite = array.reduce((previous, current) => {
        return current.likes > previous.likes ? current : previous;
      })
      return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
   }

   const mostBlogs = blogs => {
  
    const blogCountByAuthor =_.countBy(blogs, 'author');

    const maxAuthor =_.maxBy(_.toPairs(blogCountByAuthor), ([, count]) => count);
    return {
        author: maxAuthor[0],
        blogs: maxAuthor[1]};
  }

  const mostLikes = blogs => {
   
    const blogsByAuthor =_.groupBy(blogs, 'author');
   
    const likesByAuthor =_.map(blogsByAuthor, (blogs, author) => ({
      author,
      likes:_.sumBy(blogs, 'likes'),
    }));
    
    const authorWithMostLikes = _.maxBy(likesByAuthor, 'likes');
    return authorWithMostLikes;
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }