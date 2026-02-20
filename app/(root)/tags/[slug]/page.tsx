import BlogCard from "@/components/cards/blog"
import { getDetailedBlog } from "@/service/blog.service"
import { getBlogsByTag } from "@/service/tag.service"
import { Dot, Home } from "lucide-react"
import Link from "next/link"
interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const tag = await getBlogsByTag(slug)

  return {
    title: tag.name,
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const tag = await getBlogsByTag(slug)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative min-h-[30vh] flex items-center justify-end flex-col">
        <h2 className="text-center text-4xl section-title font-creteRound mt-2">
          <span>{tag.name}</span>
        </h2>

        <div className="flex gap-1 items-center mt-4">
          <Home className="w-4 h-4" />
          <Link
            href="/"
            className="opacity-90 hover:underline hover:opacity-100"
          >
            Home
          </Link>
          <Dot />
          <p className="text-muted-foreground">Tags</p>
        </div>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-x-4 gap-y-24 mt-24">
        {tag.blogs.map(blog => (
          <BlogCard key={blog.title} {...blog} isVertical />
        ))}
      </div>
    </div>
  )
}