import { getXataClient } from '@/xata';
import Link from 'next/link';

const xata = getXataClient();

export default async function Home({ searchParams }: { searchParams: { q: string } }) {
  let posts: any = null;

  if (searchParams.q) {
    posts = await xata.db.Posts.search(searchParams.q, { fuzziness: 2 });
  } else {
    posts = await xata.db.Posts.getAll();
  }

  posts = posts.records ? posts.records : posts

  return (
    <>
      <div className="w-full max-w-5xl mt-16 mb-4">
        <form>
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Search..."
            className="w-full rounded-lg p-2 dark:text-purple-950"
          />
        </form>
      </div>
      {posts.totalCount === 0 ? <h2 className='text-2xl underline underline-offset-3'> No blog posts found </h2>
        :
        <div className="w-full max-w-5xl mt-16">
          {posts.map((post: any) => (
            <div key={post.id} className="mb-16">
              <p className="text-xs mb-2 text-purple-950 dark:text-purple-200">{post.pubDate?.toDateString()}</p>
              <h2 className="text-2xl mb-2">
                <Link href={`posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-purple-950 dark:text-purple-200 mb-5">{post.description}</p>
              <Link
                href={`posts/${post.slug}`}
                className="px-4 py-2 font-semibold text-sm bg-purple-700 text-white rounded-lg shadow-sm w-fit"
              >
                Read more &rarr;
              </Link>
            </div>
          ))}
        </div>}
    </>
  );
}