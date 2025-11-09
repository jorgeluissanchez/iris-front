import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/public',
]

const ROLE_RULES: Array<{ 
  prefix: string
  roles: Array<'ADMIN' | 'JURY' | 'STUDENT'>
  exact?: boolean 
}> = [
  { prefix: '/app/evaluations', roles: ['JURY', 'ADMIN'] },
  { prefix: '/app/events/', roles: ['JURY', 'ADMIN'] }, 
  
  { prefix: '/app/discussions', roles: ['ADMIN'] },
  { prefix: '/app/users', roles: ['ADMIN'] },
  { prefix: '/app/profile', roles: ['ADMIN'] },
  { prefix: '/app/events', roles: ['ADMIN'], exact: true }, 
  { prefix: '/app/projects', roles: ['ADMIN'] },
  { prefix: '/app/courses', roles: ['ADMIN'] },
  
  { prefix: '/app', roles: ['ADMIN', 'JURY', 'STUDENT'], exact: true },
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((publicPath) => 
    pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  )
}

function findMatchingRule(pathname: string) {
  const exactMatch = ROLE_RULES.find(
    (rule) => rule.exact && pathname === rule.prefix
  )
  if (exactMatch) return exactMatch

  const sortedRules = [...ROLE_RULES]
    .filter((rule) => !rule.exact)
    .sort((a, b) => b.prefix.length - a.prefix.length)
  
  return sortedRules.find((rule) => pathname.startsWith(rule.prefix))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Intentar obtener información del usuario desde una cookie
  // NOTA: Ajusta 'user' al nombre real de tu cookie de sesión
  // Si tu backend usa otro nombre (ej: 'session', 'auth-token'), cámbialo aquí
  const userCookie = req.cookies.get('user')?.value

  if (!userCookie) {
    // No autenticado -> redirigir a login con redirect
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }


  let userRole: 'ADMIN' | 'JURY' | 'STUDENT' | undefined
  try {
    const userData = JSON.parse(userCookie)
    userRole = userData?.role
  } catch (error) {
    console.error('Failed to parse user cookie:', error)
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const rule = findMatchingRule(pathname)
  
  if (rule) {
    if (!userRole || !rule.roles.includes(userRole)) {
      return NextResponse.redirect(new URL('/app', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/app/:path*',
  ],
}
