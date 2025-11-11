import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5000;

// Corrige caminhos absolutos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Caminho correto para o arquivo JSON
const dataPath = path.join(__dirname, "data", "profiles.json");

// Tenta carregar o arquivo JSON
let profiles = [];
try {
  const jsonData = fs.readFileSync(dataPath, "utf-8");
  profiles = JSON.parse(jsonData);
  console.log("✅ Perfis carregados com sucesso!");
} catch (error) {
  console.error("❌ Erro ao ler o arquivo profiles.json:", error.message);
}

// Rota principal - retorna todos os perfis
app.get("/api/profiles", (req, res) => {
  res.json(profiles);
});

// Rota de busca e filtros
app.get("/api/search", (req, res) => {
  const { nome, area, senioridade } = req.query;
  let filtrados = profiles;

  if (nome) {
    filtrados = filtrados.filter(p =>
      p.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  if (area) {
    filtrados = filtrados.filter(p =>
      p.area.toLowerCase() === area.toLowerCase()
    );
  }

  if (senioridade) {
    filtrados = filtrados.filter(p =>
      p.senioridade.toLowerCase() === senioridade.toLowerCase()
    );
  }

  res.json(filtrados);
});

// Rota para obter perfil individual por ID
app.get("/api/profile/:id", (req, res) => {
  const perfil = profiles.find(p => p.id === parseInt(req.params.id));
  if (!perfil) return res.status(404).json({ erro: "Perfil não encontrado" });
  res.json(perfil);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
