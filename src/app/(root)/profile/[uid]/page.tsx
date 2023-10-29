import { Metadata, ResolvingMetadata } from 'next'
import ProfilePage from './profilepage'
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
 
  // fetch data
  const user = await fetch(`/user/${id}`).then((res) => res.json())
 
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: user.username,
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