import express from 'express';
import * as dotenv from 'dotenv';
import { growdevers } from './dados.js';
import { randomUUID } from 'crypto';

dotenv.config();
//dotenv faz com que a gente use as variáveis de .env

const app = express();

//Indica que o formato usado para CRUD no express é JSON
app.use(express.json());

//Criando as rotas

//Rota para GET http://localhost:3333/growdevers
app.get("/growdevers", (req, res) => {
    const { idade, nome, email, email_includes } = req.query;

    //tornando a variável dados uma lista de growdevers
    let dados = growdevers;

    //Se tem idade, filtra, se não mostra a lista completa
    if(idade){
        dados = dados.filter(item => item.idade === Number(idade));
    }
    if(nome){
        dados = dados.filter(item => item.nome.includes(nome));
    }
    if(email){
        dados = dados.filter((item) => item.email === email);
    }
    if(email_includes){
        dados = dados.filter(item => item.email.includes(email));
    }

    res.status(200).send({
        ok: true,
        mensagem: "Growdevers listados com sucesso",
        dados
    });
});

//Rota para GET + ID
app.get("/growdevers/:id", (req, res) => {
    // Entrada - cria a const ID e 
    // pega o valor de id dentro de params
    const { id } = req.params;

    // Processamento
    const growdever = growdevers.find((item) => item.id === id);
    if(!growdever){
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        });
    };

    // Saida
    res.status(200).send({
        ok: true,
        mensagem: "Growdever listados com sucesso",
        dados: growdever
    });
});

//Rota para POST - ainda não está adicionando no arquivo dados.js
app.post("/growdevers", (req, res) => {
    // Primeira etapa - entrada
    const body = req.body;
    const novoGrowdever = {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        idade: body.idade,
        matriculado: body.matriculado
    };

    // Segunda etapa - processamento
    growdevers.push(novoGrowdever);

    // Terceira etapa - saida
    res.status(201).send({
        ok: true,
        mensagem: "Growdever criado com sucesso",
        dados: growdevers
    });
});

//Rota para PUT - atualizar um growdever específico
app.put("/growdevers/:id", (req, res) => {
    // Primeira etapa - entrada
    const { id } = req.params;
    const { nome, email, idade, matriculado} = req.body;
    
    // Segunda etapa - processamento
    const growdever = growdevers.find(item => item.id === id);
    if(!growdever){
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        })
    }
    growdever.nome = nome;
    growdever.email = email;
    growdever.idade = idade;
    growdever.matriculado = matriculado;

    // Terceira etapa - saida
    res.status(200).send({
        ok: true,
        mensagem: "Growdever atualizado com sucesso",
        dados: growdevers
    });
});

//Rota para PATCH - atualização específica de um growdever
//Mudando o campo matriculado
app.patch("/growdevers/:id", (req, res) => {
    // Primeira etapa - entrada
    const { id } = req.params;
    
    // Segunda etapa - processamento
    const growdever = growdevers.find(item => item.id === id);
    if(!growdever){
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        })
    }
    growdever.matriculado = !growdever.matriculado;

    // Terceira etapa - saida
    res.status(200).send({
        ok: true,
        mensagem: "Growdever atualizado com sucesso",
        dados: growdevers
    });
});

//Rota para DELETE
app.delete("/growdevers/:id", (req, res) => {
    // Primeira etapa - entrada
    const { id } = req.params;
    
    // Segunda etapa - processamento
    const growdeverIndex = growdevers.findIndex(item => item.id === id);
    //findIndex retorna -1 se não existe
    if(growdeverIndex < 0){
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        })
    }
    growdevers.splice(growdeverIndex, 1);

    // Terceira etapa - saida
    res.status(200).send({
        ok: true,
        mensagem: "Growdever deletado com sucesso",
        dados: growdevers
    });
});

//Expor a porta associada no nosso computador - onde o servidor esta rodando
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`O servidor está sendo executado na porta ${port}.`);
});