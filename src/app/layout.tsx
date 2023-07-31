import '/public/fonts/fonts.css';
import '@/assets/css/app.scss'
import { Providers } from "@/redux/providers/provider";

export const metadata = {
  title: 'Reporting portal - Eventbuizz',
  description: 'Reporting portal - Eventbuizz',
}

export default async function RootLayout({ children, params: {locale}}: { children: React.ReactNode, params: {locale:string} }) {
  
  return (
    <html>
      <body>
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  )
}
