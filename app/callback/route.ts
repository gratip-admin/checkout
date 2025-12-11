import { type NextRequest, NextResponse } from "next/server"

// Handle POST redirects from payment gateways (3DS, bank redirects, etc.)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    
    let params: Record<string, string> = {}
    
    // Parse the body based on content type
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      formData.forEach((value, key) => {
        params[key] = value.toString()
      })
    } else if (contentType.includes("application/json")) {
      params = await request.json()
    } else {
      // Try to parse as form data anyway (some gateways don't set content-type properly)
      try {
        const formData = await request.formData()
        formData.forEach((value, key) => {
          params[key] = value.toString()
        })
      } catch {
        // If that fails, try to get text and parse as URL encoded
        const text = await request.text()
        const urlParams = new URLSearchParams(text)
        urlParams.forEach((value, key) => {
          params[key] = value
        })
      }
    }

    // Build redirect URL to the main page
    const url = new URL(request.url)
    url.pathname = "/"
    
    // Clear existing search params and add parsed ones
    url.search = ""
    
    // Add all parsed parameters to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value)
      }
    })

    // Preserve any existing query parameters from the original request URL
    const originalParams = new URL(request.url).searchParams
    originalParams.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    })

    // Redirect to the page with GET method (303 forces GET)
    return NextResponse.redirect(url.toString(), { status: 303 })
  } catch (error) {
    console.error("Error handling payment redirect:", error)
    
    // Fallback: redirect to page anyway with error indicator
    const url = new URL(request.url)
    url.pathname = "/"
    url.search = ""
    url.searchParams.set("error", "redirect_failed")
    
    return NextResponse.redirect(url.toString(), { status: 303 })
  }
}

// Also handle GET requests (some gateways use GET for callbacks)
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const redirectUrl = new URL(request.url)
  redirectUrl.pathname = "/"
  
  // Forward all query parameters to the main page
  return NextResponse.redirect(redirectUrl.toString(), { status: 302 })
}

