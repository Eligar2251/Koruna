import type { Metadata } from 'next'
import { HomePage } from '../components/pages/home/HomePage'

export const metadata: Metadata = {
  title: "\u0426\u0421\u0411 \u2014 \u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u0430\u044f \u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u0411\u0430\u0437\u0430",
}

export default function Page() {
  return <HomePage />
}
