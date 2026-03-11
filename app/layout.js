import './globals.css'

export const metadata = {
    title: 'Mercado Estación',
    description: 'Gestión de clientes y giros',
}

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    )
}
