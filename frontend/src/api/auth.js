const PORT = import.meta.env.VITE_PORT_BACKEND;

export async function login(email, password) {
  const res = await fetch(`http://localhost:${PORT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  return res.json();
}

