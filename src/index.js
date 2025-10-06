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
    res.status(200).send({
        ok: true,
        mensagem: "Growdevers listados com sucesso",
        dados: growdevers
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

//Rota para POST
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

//Expor a porta associada no nosso computador - onde o servidor esta rodando
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`O servidor está sendo executado na porta ${port}.`);
});