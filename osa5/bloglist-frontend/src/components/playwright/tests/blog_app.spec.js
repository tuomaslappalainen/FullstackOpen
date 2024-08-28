const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    
    await request.post('http://localhost:5173/api/testing/reset')

    
    const user = {
      username: 'testuser',
      password: 'password123',
      name: 'Test User'
    }
    await request.post('http://localhost:5173/api/users', { data: user })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.$('form#login')
    expect(loginForm).not.toBeNull()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')

     
      const logoutButton = await page.$('button#logout')
      expect(logoutButton).not.toBeNull()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')

     
      const errorMessage = await page.$('text=Invalid username or password')
      expect(errorMessage).not.toBeNull();
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'password123')
      await page.click('button[type="submit"]')

      
      const logoutButton = await page.$('button#logout')
      expect(logoutButton).not.toBeNull()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.click('button#new-blog')
      await page.fill('input[name="title"]', 'New Blog Title')
      await page.fill('input[name="author"]', 'New Blog Author')
      await page.fill('input[name="url"]', 'http://newblog.com')
      await page.click('button[type="submit"]')

     
      const newBlog = await page.$('text=New Blog Title')
      expect(newBlog).not.toBeNull()
    })

    test('a blog can be liked', async ({ page }) => {
      
        await page.click('button#new-blog'); 
        await page.fill('input[name="title"]', 'New Blog Title')
        await page.fill('input[name="author"]', 'New Blog Author')
        await page.fill('input[name="url"]', 'http://newblog.com')
        await page.click('button[type="submit"]')
  
       
        const newBlog = await page.$('text=New Blog Title')
        expect(newBlog).not.toBeNull()
  
       
        await page.click('button#like-blog')
  
        
        const likeCount = await page.$('text=Likes: 1')
        expect(likeCount).not.toBeNull()
      })

      test('the user who added the blog can delete it', async ({ page }) => {
       
        await page.click('button#new-blog'); 
        await page.fill('input[name="title"]', 'New Blog Title')
        await page.fill('input[name="author"]', 'New Blog Author')
        await page.fill('input[name="url"]', 'http://newblog.com')
        await page.click('button[type="submit"]')
  
        
        const newBlog = await page.$('text=New Blog Title')
        expect(newBlog).not.toBeNull()
  
      
        await page.click('button#delete-blog'); 
  
        
        const deletedBlog = await page.$('text=New Blog Title')
        expect(deletedBlog).toBeNull()
      })
    
      test('only the user who added the blog sees the delete button', async ({ page, context }) => {
    
      await page.click('button#new-blog')
      await page.fill('input[name="title"]', 'New Blog Title')
      await page.fill('input[name="author"]', 'New Blog Author')
      await page.fill('input[name="url"]', 'http://newblog.com')
      await page.click('button[type="submit"]')

      
      const newBlog = await page.$('text=New Blog Title')
      expect(newBlog).not.toBeNull()

   
      const deleteButton = await page.$('button#delete-blog')
      expect(deleteButton).not.toBeNull()

     
      await page.click('button#logout')

     
      await page.fill('input[name="username"]', 'anotheruser')
      await page.fill('input[name="password"]', 'password456')
      await page.click('button[type="submit"]')

      const anotherUserBlog = await page.$('text=New Blog Title')
      expect(anotherUserBlog).not.toBeNull()

      
      const anotherUserDeleteButton = await page.$('button#delete-blog')
      expect(anotherUserDeleteButton).toBeNull()
    })

    test('blogs are arranged in order according to likes', async ({ page }) => {
        
        await page.click('button#new-blog')
        await page.fill('input[name="title"]', 'Blog eka')
        await page.fill('input[name="author"]', 'Author eka')
        await page.fill('input[name="url"]', 'http://blogeka.com')
        await page.click('button[type="submit"]')
  
        await page.click('button#new-blog')
        await page.fill('input[name="title"]', 'Blog toka')
        await page.fill('input[name="author"]', 'Author toka')
        await page.fill('input[name="url"]', 'http://blogtoka.com')
        await page.click('button[type="submit"]')
  
        await page.click('button#new-blog')
        await page.fill('input[name="title"]', 'Blog kolmas')
        await page.fill('input[name="author"]', 'Author kolmas')
        await page.fill('input[name="url"]', 'http://blogkolmas.com')
        await page.click('button[type="submit"]')
  
        
        await page.click('text=Blog eka')
        await page.click('button#like-blog')
        await page.click('button#like-blog')
  
        await page.click('text=Blog toka')
        await page.click('button#like-blog')
  
       
        const blogs = await page.$$eval('.blog', blogs => blogs.map(blog => blog.textContent))
        expect(blogs[0]).toContain('Blog eka')
        expect(blogs[1]).toContain('Blog toka')
        expect(blogs[2]).toContain('Blog kolmas')
      })
    })
  })


