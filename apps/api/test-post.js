const fs = require('fs');

async function test() {
  // Login first
  const loginRes = await fetch('https://api.almunawwaroh.id/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'almunawwaroh.ketua', password: 'password123' })
  });
  
  // We don't have the real password. Is it 123456?
}
test();
