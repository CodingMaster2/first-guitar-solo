import ResetPasswordClient from './ResetPasswordClient'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params
  return <ResetPasswordClient token={token} />
}
