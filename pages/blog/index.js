import Head from 'next/head';
import Link from 'next/link';
import { useAmp } from 'next/amp';

// data
import { getAllPosts } from '../../lib/api';

// styles
import styles from '../../styles/Home.module.css';
import blogStyles from '../../styles/Blog.module.css';

export const config = { amp: 'hybrid' };

const Blog = ({ allPosts: { edges } }) => {
  const isAmp = useAmp();
  return (
    <div className={styles.container}>
      <Head>
        <title>Blog articles page</title>
        <link rel="icon" href="/favicon.ico" />
        <style jsx>
          {`
            .container {
              min-height: 100vh;
              padding: 0 0.5rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Latest blog articles</h1>
        <hr />
        <section>
          {edges.map(({ node }) => (
            <div className={blogStyles.listitem} key={node.id}>
              <div className={blogStyles.listitem__thumbnail}>
                <figure>
                  {isAmp ? (
                    <amp-img
                      width="300"
                      height="300"
                      src={node?.featuredImage?.sourceUrl || `https://piotrkowalski.pw/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png`}
                      alt={node.title}
                      layout="responsive"
                    />
                  ) : (
                    <img
                      src={node?.featuredImage?.sourceUrl}
                      alt={node.title}
                    />
                  )}
                </figure>
              </div>
              <div className={blogStyles.listitem__content}>
                <h2>{node.title}</h2>
                {/* <p>{node.extraPostInfo.authorExcerpt}</p> */}
                <Link href={`/blog/${node.slug}`}>
                  <a>Read more ></a>
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Blog;

export const getStaticProps = async () => {
  const allPosts = await getAllPosts();
  return {
    props: {
      allPosts,
    },
  };
};
