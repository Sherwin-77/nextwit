import { Metadata, ResolvingMetadata } from 'next'
import ProfilePage from './profilepage'
 
type Props = {
  params: { username?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const username = params.username
  if(!username) return {
    title: "Profile",
    description: "Get your account now"
  }
 
  // fetch data
  const user = await fetch(`/user/${username}?type=username`).then((res) => res.json())
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: user.username,
    description: user.bio ?? `Profile of ${user.username}`,
    openGraph: {
      images: previousImages,
    },
  }
}
 
export default function Page({ params, searchParams }: Props) {
    return (
        <ProfilePage params={params} searchParams={searchParams} />
    )
}