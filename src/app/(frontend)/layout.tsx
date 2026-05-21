import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Content management for the Koplus Sam product line — products, colors, palettes, and accessories.',
  icons: {
    icon: 'https://cdn.prod.website-files.com/5edcaf96992873f032795a12/5ef20e6ee977cfdd038b196c_Koplus-favcon-32x32px.png',
  },
  title: 'Koplus Sam CMS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
