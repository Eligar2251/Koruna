import type { Metadata } from 'next'
import { ContactPage } from '../../components/pages/contact/ContactPage'

export const metadata: Metadata = {
  title: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b",
}

export default function Page() {
  return <ContactPage />
}
