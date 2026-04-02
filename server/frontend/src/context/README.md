# Onerilen Auth Context

Frontend tarafinda `api.auth.login()` ve `api.auth.me()` kullanan bir `AuthContext` olusturulabilir.

Temel akis:

1. Login formu `api.auth.login({ email, password })` cagirir.
2. Token `localStorage` icinde saklanir.
3. Uygulama acilisinda `api.auth.me()` ile oturum dogrulanir.
4. Rol bazli gorunum kurallari bu context uzerinden yonetilir.
