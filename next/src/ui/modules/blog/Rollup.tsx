import { fetchSanity, groq } from '@/lib/sanity'
import CTAList from '@/ui/CTAList'
import { PortableText } from '@portabletext/react'
import PostPreview from './PostPreview'
import { cn } from '@/lib/utils'

export default async function Rollup({
	postsOverride,
	content,
	ctas,
	layout,
	heading,
}: Partial<{
	postsOverride: Sanity.BlogPost[]
	content: any
	ctas: Sanity.CTA[]
	layout: 'carousel' | 'grid'
	heading: React.ReactNode
}>) {
	const posts = await fetchSanity<Sanity.BlogPost[]>(
		groq`*[_type == 'blog.post' && defined(body)]|order(publishDate desc){
			...,
			categories[]->,
			author->
		}`,
		{ tags: ['posts'] },
	)

	return (
		<section className="section space-y-6">
			<header className="flex flex-wrap items-end gap-x-4 gap-y-2">
				<div className="richtext grow">
					{heading || <PortableText value={content} />}
				</div>

				<CTAList ctas={ctas} />
			</header>

			<ul
				className={cn(
					'gap-8',
					layout === 'carousel'
						? 'carousel max-md:full-bleed *:grow max-md:px-4 md:[--size:275px]'
						: 'grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
				)}
			>
				{(postsOverride || posts)?.map((post, key) => (
					<li key={key}>
						<PostPreview post={post} />
					</li>
				))}
			</ul>
		</section>
	)
}
