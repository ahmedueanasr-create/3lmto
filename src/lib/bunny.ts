const BUNNY_API = "https://video.bunnycdn.com/library"

export async function getBunnyVideo(videoId: string): Promise<{ title: string; embedUrl: string } | null> {
  const libraryId = process.env.BUNNY_LIBRARY_ID
  const apiKey = process.env.BUNNY_API_KEY

  if (!libraryId || !apiKey) return null

  try {
    const res = await fetch(`${BUNNY_API}/${libraryId}/videos/${videoId}`, {
      headers: { AccessKey: apiKey },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      title: data.title,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`,
    }
  } catch {
    return null
  }
}

export function generateBunnyEmbedUrl(videoId: string): string {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`
}
