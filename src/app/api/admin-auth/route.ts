import { NextResponse } from "next/server";

const ADMIN_EMAIL = "adminlogin@aavisit.com";
const ADMIN_PASSWORD = "AdminPassword@IT";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        message: "Admin authentication successful",
        token: "aavisit_admin_authenticated_session",
      });

      // Set session cookie (cleared when browser closes)
      response.cookies.set({
        name: "admin_session",
        value: "aavisit_admin_authenticated_session",
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid admin email or password. Please try again." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication server error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("admin_session");
  return response;
}
