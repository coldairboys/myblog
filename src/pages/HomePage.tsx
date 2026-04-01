import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { MarkdownDocument } from '../markdown/MarkdownDocument'
import { useParsedMarkdown } from '../hooks/useParsedMarkdown'
import { POST_INDEX_BY_LOCALE } from '../i18n/postIndex'
import { CategorySidebar } from '../components/layout/CategorySidebar'
import { TagSidebar } from '../components/layout/TagSidebar'
import { SocialLinks } from '../components/layout/SocialLinks'
import { SafeImg } from '../components/HttpsFallbackImg'
import { useLocalePath } from '../utils/useLocalePath'

export function HomePage() {
  const { locale, t } = useI18n()
  const { getLocalePath } = useLocalePath()
  const md = useParsedMarkdown(`/content/${locale}/home.md`)

  const posts = POST_INDEX_BY_LOCALE[locale] ?? []

  const latestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 6)
  }, [posts])

  const stats = useMemo(() => {
    const tagCount = new Set(posts.flatMap((post) => post.tags ?? [])).size
    return [
      { label: '文章', value: posts.length },
      { label: '标签', value: tagCount },
      { label: '语言', value: 4 },
    ]
  }, [posts])

  if (md.status === 'loading') {
    return <p className="page-state">{t('state.loading')}</p>
  }
  if (md.status === 'error') {
    return (
      <p className="page-state page-state--error">
        {t('state.error')}: {md.message}
      </p>
    )
  }

  return (
    <div className="page page--home">
      <div className="home-layout">
        <aside className="home-layout__welcome">
          <section className="glass-card home-welcome">
            <div className="home-welcome__hero">
              <div>
                <p className="home-welcome__eyebrow">Personal blog · notes · experiments</p>
                <h1 className="home-welcome__title">{t('home.welcome')}</h1>
              </div>
              <div className="home-welcome__actions">
                <Link to={getLocalePath('/blog')} className="home-welcome__btn home-welcome__btn--primary">
                  去看文章
                </Link>
                <Link to={getLocalePath('/about')} className="home-welcome__btn">
                  了解我
                </Link>
              </div>
            </div>

            <div className="home-welcome__content">
              <MarkdownDocument source={md.body} />
            </div>

            <div className="home-stats" aria-label="site stats">
              {stats.map((item) => (
                <div key={item.label} className="home-stat-card">
                  <span className="home-stat-card__value">{item.value}</span>
                  <span className="home-stat-card__label">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <div className="home-layout__center">
          <section className="home-featured">
            <div className="home-featured__head">
              <div>
                <p className="home-featured__eyebrow">Freshly published</p>
                <h2 className="section-title home-featured__title">{t('home.featured')}</h2>
              </div>
              <Link to={getLocalePath('/blog')} className="home-featured__all">
                {t('home.viewAll')}
                <span aria-hidden> →</span>
              </Link>
            </div>

            {latestPosts.length === 0 ? (
              <p className="home-featured__empty md-p">{t('home.noPosts')}</p>
            ) : (
              <div className="featured-grid">
                {latestPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={getLocalePath(`/post/${post.slug}`)}
                    className="post-card"
                  >
                    {post.icon ? (
                      <div className="post-card__img-wrap">
                        <SafeImg className="post-card__img" src={post.icon} alt="" loading="lazy" />
                      </div>
                    ) : null}
                    <div className="post-card__body">
                      <div className="post-card__meta">
                        <time
                          className="post-card__date"
                          dateTime={post.date}
                        >
                          {post.date}
                        </time>
                        {post.tags?.[0] ? <span className="post-card__tag">#{post.tags[0]}</span> : null}
                      </div>
                      <h3 className="post-card__title">{post.title}</h3>
                      {post.excerpt ? (
                        <p className="post-card__excerpt">{post.excerpt}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="home-layout__rail" aria-label={t('sidebar.categories')}>
          <section className="glass-card home-rail">
            <CategorySidebar />
            <TagSidebar />
            <SocialLinks variant="spread" />
          </section>
        </aside>
      </div>
    </div>
  )
}
