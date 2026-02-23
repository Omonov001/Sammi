import request, { gql } from 'graphql-request'
import { IArchivedBlog, IBlog } from '@/types'

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!

// ================= BLOG LIST =================
export const getBlogs = async (): Promise<IBlog[]> => {
  const query = gql`
    query MyQuery {
      blogs {
        title
        createdAt
        author {
          name
          image { url }
        }
        category { name slug }
        description
        tag { name slug }
        image { url }
        content { html }
        slug
      }
    }
  `

  const { blogs } = await request<{ blogs: IBlog[] }>(
    graphqlAPI,
    query
  )

  return blogs
}


// ================= BLOG DETAIL =================
export const getDetailedBlog = async (slug: string): Promise<IBlog> => {
  const query = gql`
    query MyQuery($slug: String!) {
      blog(where: { slug: $slug }) {
        author {
          name
          image { url }
          bio
          id
        }
        content { html }
        createdAt
        image { url }
        slug
        tag { name slug }
        title
      }
    }
  `

  const { blog } = await request<{ blog: IBlog }>(
    graphqlAPI,
    query,
    { slug }
  )

  return blog
}


// ================= SEARCH =================
export const getSearchBlogs = async (title: string) => {
  const query = gql`
    query MyQuery($title: String!) {
      blogs(where: { title_contains: $title }) {
        title
        image { url }
        slug
        createdAt
      }
    }
  `

  const { blogs } = await request<{ blogs: IBlog[] }>(
    graphqlAPI,
    query,
    { title }
  )

  return blogs
}


// ================= ARCHIVE =================
export const getArchiveBlogs = async (): Promise<IArchivedBlog[]> => {
  const query = gql`
    query MyQuery {
      blogs(where: { archive: true }) {
        title
        createdAt
        slug
      }
    }
  `

  const { blogs } = await request<{ blogs: IBlog[] }>(
    graphqlAPI,
    query
  )

  const filteredBlogs = blogs.reduce(
    (acc: { [year: string]: IArchivedBlog }, blog: IBlog) => {
      const year = blog.createdAt.substring(0, 4)

      if (!acc[year]) {
        acc[year] = { year, blogs: [] }
      }

      acc[year].blogs.push(blog)
      return acc
    },
    {}
  )

  return Object.values(filteredBlogs)
}