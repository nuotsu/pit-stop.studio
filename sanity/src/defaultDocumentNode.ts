import { isDev, type SanityDocument } from 'sanity'
import { Iframe } from 'sanity-plugin-iframe-pane'
import type { DefaultDocumentNodeResolver } from 'sanity/structure'

const defaultDocumentNode: DefaultDocumentNodeResolver = (
	S,
	{ schemaType },
) => {
	switch (schemaType) {
		case 'page':
		case 'blog.post':
		case 'employee':
			return S.document().views([
				S.view.form(),
				S.view
					.component(Iframe)
					.options({
						url: (doc: SanityPage) => {
							const domain = isDev
								? 'http://localhost:3000'
								: 'https://pit-stop.studio'

							const slug = doc?.metadata?.slug?.current
							const path = slug === 'index' ? '' : slug
							const directory =
								schemaType === 'blog.post'
									? 'blog'
									: schemaType === 'employee'
										? 'employee'
										: null

							return [domain, directory, path].filter(Boolean).join('/')
						},
						reload: {
							button: true,
						},
					})
					.title('Preview'),
			])

		default:
			return S.document().views([S.view.form()])
	}
}

export default defaultDocumentNode

type SanityPage = SanityDocument & {
	metadata?: { slug?: { current: string } }
}
