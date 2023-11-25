# # Desafio Backend

Este é um guia de como rodar o projeto do **backend**, que é uma **API RESTful** para **autenticação de usuários**. Certifique-se de seguir as etapas abaixo para configurar e executar o projeto com sucesso.

## # Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado no seu sistema:
-   [Node.js](https://nodejs.org/)
-   [SQLite](https://www.sqlite.org/download.html)

## # Passos para Rodar o Projeto
### Clone o Repositório
Clone o repositório do projeto para o seu sistema local:

 ```
git clone https://github.com/rubens-correa/api-desafio.git
 ```

### Instale as Dependências

No diretório do projeto, instale as dependências utilizando o npm:

```
cd api-desafio
npm install
```

### Inicialize o Banco de Dados

Certifique-se de que o SQLite está instalado. O banco de dados será criado automaticamente ao iniciar o aplicativo.

### Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do seu projeto e adicione as seguintes variáveis:

```
PORT=3000 
SECRET_KEY=secreto
```

Substitua `secreto` pela chave secreta que você deseja para a geração de tokens JWT.

### Execute o Projeto

 ```
npm start
 ```

O servidor estará rodando em [http://localhost:3000](http://localhost:3000/).

# Teste a API

Utilize ferramentas como Insomnia ou Postman para testar os endpoints fornecidos na API.

#### Endpoints
**Cadastro de Usuário (Sign Up):**

-   Método: POST
    
-   URL: [http://localhost:3000/signup](http://localhost:3000/signup)
    
-   Corpo da Requisição:
 ```
  {
	  "nome": "Seu Nome",
	  "email": "seu.email@example.com",
	  "senha": "suaSenha",
	  "telefones": [{"numero": "123456789", "ddd": "11"}]
  }
```

**Autenticação de Usuário (Sign In):**

-   Método: POST
    
-   URL: [http://localhost:3000/signin](http://localhost:3000/signin)
    
-   Corpo da Requisição:
  
```
{
  "email": "seu.email@example.com",
  "senha": "suaSenha"
}
```

**Recuperação de Informações do Usuário:**

-   Método: GET
-   URL: [http://localhost:3000/user/seu.email@example.com](http://localhost:3000/user/seu.email@example.com)
-   Requisição: Header Authentication com valor "Bearer {token}"

### Encerre o Projeto

Para encerrar o servidor, pressione Ctrl + C no terminal.
