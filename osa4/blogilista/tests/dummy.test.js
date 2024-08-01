const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {
    const listWithZeroBlogs = []

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

    const listWithMultipleBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement  Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]
  
    test('of an empty list is zero', () => {
        const result = listHelper.totalLikes(listWithZeroBlogs)
        assert.strictEqual(result, 0)
      })
    
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 15)
    })
  })

describe('favorite blog', () => { 
    const listWithNoBlog = [];

    const listOfBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 7,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement  Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 3,
            __v: 0
        }
    ]

    test('of an empty list is null', () => {
        const result = listHelper.blogWithMostLikes(listWithNoBlog);
        assert.strictEqual(result, null);
    });

    test('of a list with multiple blogs returns the blog with the most likes', () => {
        const expected = {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 7,
            __v: 0
        };
        const result = listHelper.blogWithMostLikes(listOfBlogs);
        assert.deepStrictEqual(result, expected);
  })
})

describe('most blogs', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ];
  
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Reflections on Trusting Trust',
        author: 'Ken Thompson',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f10',
        title: 'The Humble Programmer',
        author: 'Edsger W. Dijkstra',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 7,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f11',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 2,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f12',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 4,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f13',
        title: 'The Clean Coder',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 3,
        __v: 0
      }
    ];
  
    test('when list has only one blog, equals the author of that', () => {
      const result = listHelper.authorWithMostBlogs(listWithOneBlog);
      assert.deepStrictEqual(result, {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      });
    });
  
    test('when list has multiple blogs, returns the author with most blogs', () => {
      const result = listHelper.authorWithMostBlogs(listWithMultipleBlogs);
      assert.deepStrictEqual(result, {
        author: 'Robert C. Martin',
        blogs: 3
      });
    });
  
    test('when list has no blogs, returns null', () => {
      const result = listHelper.authorWithMostBlogs([]);
      assert.strictEqual(result, null);
    });
});

describe('author with most likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ];
  
    const listWithMultipleBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Reflections on Trusting Trust',
        author: 'Ken Thompson',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f10',
        title: 'The Humble Programmer',
        author: 'Edsger W. Dijkstra',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 7,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f11',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 2,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f12',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 4,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f13',
        title: 'The Clean Coder',
        author: 'Robert C. Martin',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 3,
        __v: 0
      }
    ];
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.mostLikes(listWithOneBlog);
      assert.deepStrictEqual(result, {
        author: 'Edsger W. Dijkstra',
        likes: 5
      });
    });
  
    test('when list has multiple blogs, returns the author with most likes', () => {
      const result = listHelper.mostLikes(listWithMultipleBlogs);
      assert.deepStrictEqual(result, {
        author: 'Edsger W. Dijkstra',
        likes: 12
      });
    });
  });