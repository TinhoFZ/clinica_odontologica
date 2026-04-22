# Clínica odontológica
Isso é um simples projeto criando um website de uma clínica odontológica usando Node no backend, e React no frontend.

## Instalação
Use Node Package Manager [NPM](https://nodejs.org/en/download) e [Git](https://git-scm.com/install/)

```git clone https://github.com/TinhoFZ/clinica_odontologica
cd clinica_odontologica
npm i
```

## Rodando projeto
Será necessário dois CMDs, um para o backend, e um para o frontend, ou, para testar apenas o backend, um CMD + POSTMAN


### Rodando backend
Adicione o código de '/backend/db/db_sql.sql' a uma conexão MySQL.
Crie um arquivo .env e o configure:
```DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
```

Então, no terminal:

```cd backend
node index.js
# Se preferir usar nodemon
npx nodemon index.js
```

### Rodando frontend

```cd frontend
npm run dev
```

### Usando POSTMAN
Tenha certeza de que o backend está rodando.

Use o arquivo '.postman_collection.json' na root do projeto, ou siga os passos a seguir:

Sempre adicione o port sendo usado no backend no inicio do URL:
```http://localhost:{PORT}```
#### Register Patient
*   Method: POST
*   URL: /patients/register
*   Body raw JSON:
```
{
  "name": "Teste",
  "cpf": "123",
  "email": "a@a",
  "phone_number": "4567",
  "password_hash": "a",
  "address": "Brasil",
  "birth_date": "2024-12-25"
}
```

#### Register Dentist
*   Method: POST
*   URL: /dentists/register
*   Body raw JSON:
```
{
	"name": "Teste",
    "cpf": "123",
    "cro": "321",
    "email": "a@a",
    "phone_number": "456",
    "password_hash": "a",
    "specialty": "Everything"
}
```