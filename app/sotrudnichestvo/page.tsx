import type { Metadata } from 'next'
import { SotrudnichestvoPage } from '../../components/pages/sotrudnichestvo/SotrudnichestvoPage'

export const metadata: Metadata = {
  title: "\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0439 \u0438 \u043e\u043f\u0442\u043e\u0432\u044b\u0445 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u0441 \u0426\u0421\u0411",
}

export default function Page() {
  return <SotrudnichestvoPage />
}
