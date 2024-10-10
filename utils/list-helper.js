const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((sum, { likes }) => sum + likes, 0);
  // const sum = blogs.reduce((sum, blog) => sum + blog.likes, 0);

  return sum;
};

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  // { 'Michael Chan': 1, 'Edsger W. Dijkstra': 2, 'Robert C. Martin': 3 }
  const countAuthors = blogs.reduce((counter, blog) => {
    counter[blog.author] = (counter[blog.author] || 0) + 1;
    return counter;
  }, {});

  // Robert C. Martin
  const mostBlogsAuthor = Object.keys(countAuthors).reduce((prev, current) =>
    countAuthors[current] > countAuthors[prev] ? current : prev
  );

  // { author: 'Robert C. Martin', blogs: 3 }
  return { author: mostBlogsAuthor, blogs: countAuthors[mostBlogsAuthor] };
};

const mostLikes = (blogs) => {
  const countLikesByAuthor = blogs.reduce((sum, blog) => {
    sum[blog.author]
      ? (sum[blog.author] += blog.likes)
      : (sum[blog.author] = blog.likes);

    return sum;
  }, {});

  const getMostLikedAuthors = Object.keys(countLikesByAuthor).reduce(
    (prev, current) =>
      countLikesByAuthor[current] > countLikesByAuthor[prev] ? current : prev
  );

  // { author: "Edsger W. Dijkstra", likes: 17 }
  return {
    author: getMostLikedAuthors,
    likes: countLikesByAuthor[getMostLikedAuthors],
  };
};

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

console.log('mostLikes(blogs)', mostLikes(blogs));

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
