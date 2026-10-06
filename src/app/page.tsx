import LandingPage from '@/components/LandingPage'
import GraduateCountBadge from '@/components/GraduateCountBadge'
import GraduatesTeaser from '@/components/GraduatesTeaser'

export default function Page() {
  return (
    <LandingPage
      graduateCountBadge={<GraduateCountBadge />}
      graduatesTeaser={<GraduatesTeaser />}
    />
  )
}
