import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAmp } from 'next/amp';
import { Button, CagThemeProvider } from '@cag/cag-components';

import { getAllPostsWithSlug, getPost } from '../../lib/api';

import styles from '../../styles/Home.module.css';
import blogStyles from '../../styles/Blog.module.css';

export const config = { amp: 'hybrid' }

export default function Post({ postData }) {
  const isAmp = useAmp();
  const router = useRouter();
  if (!router.isFallback && !postData?.slug) {
    return <p>No Post is found</p>;
  }

  const formatDate = date => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
  }

  const renderContent = (postContent) => {
    // console.log('postContent', postContent);
    const newPostContent = String(postContent)
      .substring(3, postContent.length - 5)
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8243;/g, '"');

      // console.log('newPostContent', newPostContent);

    const postContentArray = JSON.parse(newPostContent);
    return postContentArray.map(content => {
      return <div><ContentParse  {...content} /></div>
    })
  }

  const ContentParse = (props) => {
    switch(props.type) {
      case 'paragraph': {
        return props.children.map((child => {
          if (child.bold) {
            return <span style={{fontWeight: 'bold'}}>{child.text}</span>
          } else if (child.italic) {
            return <span style={{fontStyle: 'italic'}}>{child.text}</span>
          } else {
            return <span>{child.text}</span>
          }
        }));
      };
      case 'cag-button': {
        return (
          <span>
            <Button>{props.newTitle}</Button>
          </span>
        );
      };
      default: return <Button></Button>;
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{postData.title}</title>
        <link rel="icon" ref="icon" href="/favicon.ico" />
      </Head>
      <CagThemeProvider>
        <main className={styles.main}>
          {
            router.isFallback ? (
              <h2>Loading...</h2>
            ) : (
              <article className={blogStyles.article}>
                <div className={blogStyles.postmeta}>
                  <h1 className={styles.title}>{postData.title}</h1>
                  <p>{formatDate(postData.date)}</p>
                </div>
                <div className="post-content content">{renderContent(postData.content)}</div>
              </article>
            )
          }
          <p>
            <Link href="/blog">
              <a>back to articles</a>
            </Link>
          </p>
        </main>
      </CagThemeProvider>
    </div>
  )
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths: allPosts.edges.map(({ node }) => `/blog/${node.slug}`) ||  [],
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const data = await getPost(params.slug);

  return {
    props: {
      postData: data.postBy
    }
  }
}